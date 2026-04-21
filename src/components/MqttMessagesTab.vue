<template>
  <div class="mqtt-messages-tab">
    <div class="messages-header">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Messages</span>
          <span class="stat-value">{{ totalMessages }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Subscriptions</span>
          <span class="stat-value">{{ subscriptions.length }}</span>
        </div>
      </div>

      <div class="controls">
        <input
          v-model="filterTopic"
          type="text"
          placeholder="Filter by topic..."
          class="filter-input"
        />
        <button
          type="button"
          class="btn btn-secondary"
          @click="toggleAutoScroll"
        >
          {{ autoScroll ? '📍 Auto-scroll: ON' : '📍 Auto-scroll: OFF' }}
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="clearMessages"
          :disabled="totalMessages === 0"
        >
          Clear
        </button>
      </div>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-if="filteredMessages.length === 0" class="no-messages">
        <p>{{ totalMessages === 0 ? 'No messages yet. Subscribe to a topic.' : 'No messages match the filter.' }}</p>
      </div>

      <div
        v-for="message in filteredMessages"
        :key="message.id"
        class="message-item"
      >
        <div class="message-header">
          <span class="message-topic">{{ message.topic }}</span>
          <div class="message-meta">
            <span class="qos-badge" :class="`qos-${message.qos}`">
              QoS {{ message.qos }}
            </span>
            <span v-if="message.retained" class="retained-badge">
              Retained
            </span>
            <span class="message-time">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
        </div>

        <div class="message-content">
          <pre>{{ message.payload }}</pre>
          <button
            type="button"
            class="btn-copy"
            @click="copyToClipboard(message.payload)"
            title="Copy to clipboard"
          >
            📋
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMqttStore } from '../stores/mqttStore'
import '../styles/mqtt-utils.css'
import '../styles/MqttMessagesTab.css'
export default {
  name: 'MqttMessagesTab',

  data() {
    return {
      filterTopic: '',
      autoScroll: true
    }
  },

  computed: {
    store() {
      return useMqttStore()
    },

    totalMessages() {
      return this.store.totalMessages
    },

    subscriptions() {
      return this.store.subscriptionList
    },

    filteredMessages() {
      if (!this.filterTopic.trim()) {
        return this.store.messages
      }
      
      const filter = this.filterTopic.toLowerCase()
      return this.store.messages.filter(msg =>
        msg.topic.toLowerCase().includes(filter) ||
        msg.payload.toLowerCase().includes(filter)
      )
    }
  },

  watch: {
    filteredMessages() {
      if (this.autoScroll) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    }
  },

  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },

    toggleAutoScroll() {
      this.autoScroll = !this.autoScroll
      if (this.autoScroll) {
        this.scrollToBottom()
      }
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        alert('Copied to clipboard!')
      }).catch(err => {
        console.error('Failed to copy:', err)
      })
    },

    clearMessages() {
      if (confirm('Clear all messages?')) {
        this.store.clearMessages()
      }
    }
  },

  mounted() {
    this.scrollToBottom()
  }
}
</script>