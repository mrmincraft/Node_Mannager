import { defineStore } from 'pinia'
import MqttClient from '../class/Mqtt'
import loggerService from '../utils/loggerService'

export const useMqttStore = defineStore('mqtt', {
  state: () => ({
    client: null,
    isConnected: false,
    isLogging: false,
    connectionSettings: {
      brokerUrl: 'mqtt://localhost:1883',
      clientId: `node_manager_${Date.now()}`,
      username: '',
      password: '',
      keepalive: 30,
      reconnectPeriod: 1000
    },
    subscriptions: {}, // { topic: { qos: 0, active: true } }
    messages: [], // Array of { id, topic, payload, timestamp, qos, retained }
    messageLimit: 500,
    savedConnections: []
  }),

  getters: {
    connectionStatus: (state) => {
      if (state.isConnected) return 'connected'
      if (state.client) return 'connecting'
      return 'disconnected'
    },
    
    subscriptionList: (state) => {
      return Object.entries(state.subscriptions).map(([topic, data]) => ({
        topic,
        ...data
      }))
    },

    messagesByTopic: (state) => {
      return (topic) => state.messages.filter(m => m.topic === topic)
    },

    totalMessages: (state) => state.messages.length
  },

  actions: {
    // Connection management
    async connectToBroker(settings = null) {
      if (settings) {
        this.connectionSettings = { ...this.connectionSettings, ...settings }
      }

      try {
        const options = {
          clientId: this.connectionSettings.clientId,
          keepalive: this.connectionSettings.keepalive,
          reconnectPeriod: this.connectionSettings.reconnectPeriod,
          clean: true
        }

        if (this.connectionSettings.username) {
          options.username = this.connectionSettings.username
        }
        if (this.connectionSettings.password) {
          options.password = this.connectionSettings.password
        }

        this.client = new MqttClient(
          this.connectionSettings.brokerUrl,
          options
        )

        // Set up message callback
        this.client.setOnMessageCallback((topic, payload, packet) => {
          this.addMessage(topic, payload, packet?.qos || 0, packet?.retain || false)
        })

        // Set up connection callback
        this.client.setOnConnectCallback(() => {
          this.isConnected = true
          console.log('MQTT Connected')
        })

        // Set up disconnect callback
        this.client.setOnDisconnectCallback(() => {
          this.isConnected = false
          console.log('MQTT Disconnected')
        })

        return true
      } catch (error) {
        console.error('Connection error:', error)
        return false
      }
    },

    disconnectFromBroker() {
      if (this.client) {
        this.client.disconnect()
        this.client = null
        this.isConnected = false
        this.subscriptions = {}
      }
    },

    // Subscription management
    subscribeTopic(topic, qos = 0) {
      if (!this.client || !this.isConnected) {
        console.error('Not connected to broker')
        return false
      }

      try {
        this.client.subscribe(topic, qos)
        this.subscriptions[topic] = {
          qos,
          active: true,
          subscribedAt: Date.now()
        }
        return true
      } catch (error) {
        console.error('Subscription error:', error)
        return false
      }
    },

    unsubscribeTopic(topic) {
      if (!this.client) return false

      try {
        this.client.unsubscribe(topic)
        if (this.subscriptions[topic]) {
          this.subscriptions[topic].active = false
          delete this.subscriptions[topic]
        }
        return true
      } catch (error) {
        console.error('Unsubscribe error:', error)
        return false
      }
    },

    // Message management
    addMessage(topic, payload, qos = 0, retained = false) {
      const message = {
        id: `${Date.now()}_${Math.random()}`,
        topic,
        payload,
        timestamp: new Date().toISOString(),
        qos,
        retained
      }

      this.messages.unshift(message)

      // Log message if logging is enabled
      if (this.isLogging) {
        loggerService.logMessage(topic, payload, { qos, retained })
      }

      // Limit messages to prevent memory issues
      if (this.messages.length > this.messageLimit) {
        this.messages.pop()
      }
    },

    publishMessage(topic, payload, qos = 0, retain = false) {
      if (!this.client || !this.isConnected) {
        console.error('Not connected to broker')
        return false
      }

      try {
        this.client.publish(topic, payload, qos, retain)
        return true
      } catch (error) {
        console.error('Publish error:', error)
        return false
      }
    },

    clearMessages() {
      this.messages = []
    },

    deleteMessage(messageId) {
      const index = this.messages.findIndex(m => m.id === messageId)
      if (index > -1) {
        this.messages.splice(index, 1)
      }
    },

    // Connection persistence
    saveConnection(name) {
      const connection = {
        id: `conn_${Date.now()}`,
        name,
        settings: { ...this.connectionSettings },
        savedAt: new Date().toISOString()
      }
      this.savedConnections.push(connection)
      this.persistConnections()
      return connection
    },

    loadConnection(connectionId) {
      const connection = this.savedConnections.find(c => c.id === connectionId)
      if (connection) {
        this.connectionSettings = { ...connection.settings }
        return true
      }
      return false
    },

    deleteConnection(connectionId) {
      const index = this.savedConnections.findIndex(c => c.id === connectionId)
      if (index > -1) {
        this.savedConnections.splice(index, 1)
        this.persistConnections()
      }
    },

    persistConnections() {
      // Save to localStorage
      localStorage.setItem('mqtt_connections', JSON.stringify(this.savedConnections))
    },

    loadPersistedConnections() {
      const stored = localStorage.getItem('mqtt_connections')
      if (stored) {
        try {
          this.savedConnections = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to load connections:', error)
        }
      }
    },

    // Logging management
    async startLogging() {
      if (this.isLogging) {
        console.warn('Logging already started')
        return false
      }

      try {
        const sessionName = `mqtt_session_${new Date().toISOString().replace(/[:.]/g, '-')}`
        const result = await loggerService.startSession(sessionName)
        
        if (result) {
          this.isLogging = true
          console.log('Logging started:', result)
          return true
        }
        return false
      } catch (error) {
        console.error('Failed to start logging:', error)
        return false
      }
    },

    async stopLogging() {
      if (!this.isLogging) {
        console.warn('Logging not started')
        return false
      }

      try {
        this.isLogging = false
        await loggerService.endSession()
        console.log('Logging stopped')
        return true
      } catch (error) {
        console.error('Failed to stop logging:', error)
        return false
      }
    },

    async exportMessagesTo(format = 'json') {
      try {
        const result = await loggerService.exportMessages(this.messages, format)
        return result
      } catch (error) {
        console.error('Failed to export messages:', error)
        return { success: false, error: error.message }
      }
    },

    async getLogsPath() {
      try {
        return await loggerService.getLogsPath()
      } catch (error) {
        console.error('Failed to get logs path:', error)
        return null
      }
    }
  }
})
