import { invoke } from '@tauri-apps/api/core'

/**
 * Logger Service - Handles file-based logging for MQTT messages
 * Uses Tauri v2 backend commands for file operations
 */
class LoggerService {
  constructor() {
    this.logsDir = null
    this.isInitialized = false
    this.currentSession = null
  }

  /**
   * Initialize the logger service
   */
  async initialize() {
    try {
      // Logs will be stored in the app's data directory
      // This is handled by Tauri backend
      this.isInitialized = true
      console.log('Logger service initialized')
      return true
    } catch (error) {
      console.error('Failed to initialize logger:', error)
      return false
    }
  }

  /**
   * Start a new logging session
   */
  async startSession(sessionName) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      this.currentSession = `${sessionName}_${timestamp}`
      console.log('Logging session started:', this.currentSession)
      return this.currentSession
    } catch (error) {
      console.error('Failed to start logging session:', error)
      return null
    }
  }

  /**
   * Log a single message
   */
  async logMessage(topic, payload, metadata = {}) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (!this.currentSession) {
      console.warn('No active logging session')
      return false
    }

    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        topic,
        payload,
        qos: metadata.qos || 0,
        retained: metadata.retained || false
      }

      // Call Tauri v2 backend command
      try {
        await invoke('log_message', {
          sessionName: this.currentSession,
          message: JSON.stringify(logEntry)
        })
      } catch (error) {
        // Tauri not available, log to console
        console.log('[LOG]', logEntry)
      }

      return true
    } catch (error) {
      console.error('Failed to log message:', error)
      return false
    }
  }

  /**
   * Export messages to file
   */
  async exportMessages(messages, format = 'json') {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `export_${timestamp}`

      let content = ''
      
      if (format === 'json') {
        content = JSON.stringify(messages, null, 2)
      } else if (format === 'csv') {
        content = this.convertToCSV(messages)
      } else if (format === 'txt') {
        content = this.convertToTXT(messages)
      }

      // Try Tauri v2 backend command first
      try {
        const result = await invoke('export_messages', {
          filename,
          format,
          content
        })
        return { success: true, filename: `${filename}.${format}`, path: result }
      } catch (error) {
        // Fallback to browser download if Tauri not available
        return this.exportFallback(content, filename, format)
      }
    } catch (error) {
      console.error('Failed to export messages:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Fallback export for non-Tauri environment
   */
  exportFallback(content, filename, format) {
    try {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return { success: true, filename: `${filename}.${format}` }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Convert messages to CSV format
   */
  convertToCSV(messages) {
    const headers = ['Timestamp', 'Topic', 'Payload', 'QoS', 'Retained']
    const rows = messages.map(msg => [
      new Date(msg.timestamp).toLocaleString(),
      `"${msg.topic}"`,
      `"${msg.payload.replace(/"/g, '""')}"`,
      msg.qos,
      msg.retained ? 'Yes' : 'No'
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
  }

  /**
   * Convert messages to TXT format
   */
  convertToTXT(messages) {
    return messages.map((msg, index) => {
      return `
Message #${index + 1}
${'-'.repeat(50)}
Timestamp: ${new Date(msg.timestamp).toLocaleString()}
Topic: ${msg.topic}
QoS: ${msg.qos}
Retained: ${msg.retained ? 'Yes' : 'No'}
Payload:
${msg.payload}
${'-'.repeat(50)}
`
    }).join('\n')
  }

  /**
   * Clear old logs
   */
  async clearOldLogs(daysOld = 7) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      await invoke('clear_old_logs', { daysOld })
      return true
    } catch (error) {
      console.warn('Failed to clear old logs:', error)
      return false
    }
  }

  /**
   * End current logging session
   */
  async endSession() {
    this.currentSession = null
    return true
  }
}

export default new LoggerService()
