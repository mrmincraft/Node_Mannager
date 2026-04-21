<template>
  <div class="mqtt-connection-tab">
    <div class="connection-status" :class="connectionStatus">
      <div class="status-indicator"></div>
      <span>{{ connectionStatus }}</span>
    </div>

    <form @submit.prevent="handleConnectionToggle" class="connection-form">
      <div class="form-group">
        <label for="broker-url">Broker URL</label>
        <input
          id="broker-url"
          v-model="settings.brokerUrl"
          type="text"
          placeholder="mqtt://localhost:1883"
          :disabled="isConnected"
        />
      </div>

      <div class="form-group">
        <label for="client-id">Client ID</label>
        <input
          id="client-id"
          v-model="settings.clientId"
          type="text"
          :disabled="isConnected"
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="settings.username"
            type="text"
            :disabled="isConnected"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="settings.password"
            type="password"
            :disabled="isConnected"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="keepalive">Keepalive (seconds)</label>
          <input
            id="keepalive"
            v-model.number="settings.keepalive"
            type="number"
            min="0"
            :disabled="isConnected"
          />
        </div>

        <div class="form-group">
          <label for="reconnect">Reconnect Period (ms)</label>
          <input
            id="reconnect"
            v-model.number="settings.reconnectPeriod"
            type="number"
            min="0"
            :disabled="isConnected"
          />
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="btn btn-primary" :disabled="connecting">
          {{ isConnected ? 'Disconnect' : 'Connect' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="saveConnection">
          Save Connection
        </button>
      </div>
    </form>

    <div v-if="savedConnections.length > 0" class="saved-connections">
      <h3>Saved Connections</h3>
      <div class="connection-list">
        <div
          v-for="conn in savedConnections"
          :key="conn.id"
          class="connection-item"
        >
          <div>
            <span class="conn-name">{{ conn.name }}</span>
            <span class="conn-url">{{ conn.settings.brokerUrl }}</span>
          </div>
          <div class="conn-actions">
            <button class="btn btn-small" @click="loadConnection(conn.id)">
              Load
            </button>
            <button class="btn btn-small btn-danger" @click="deleteConnection(conn.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMqttStore } from '../stores/mqttStore'
import '../styles/mqtt-utils.css'
import '../styles/MqttConnectionTab.css'
export default {
  name: 'MqttConnectionTab',
  
  data() {
    return {
      settings: {},
      connecting: false,
      connectionNameInput: ''
    }
  },

  computed: {
    store() {
      return useMqttStore()
    },

    isConnected() {
      return this.store.isConnected
    },

    connectionStatus() {
      return this.store.connectionStatus
    },

    savedConnections() {
      return this.store.savedConnections
    }
  },

  methods: {
    async handleConnectionToggle() {
      this.connecting = true
      try {
        if (this.isConnected) {
          this.store.disconnectFromBroker()
        } else {
          await this.store.connectToBroker(this.settings)
        }
      } catch (error) {
        console.error('Connection error:', error)
      } finally {
        this.connecting = false
      }
    },

    saveConnection() {
      const name = prompt('Enter a name for this connection:')
      if (name && name.trim()) {
        this.store.saveConnection(name.trim())
        alert(`Connection "${name}" saved!`)
      }
    },

    loadConnection(connectionId) {
      this.store.loadConnection(connectionId)
      this.settings = { ...this.store.connectionSettings }
    },

    deleteConnection(connectionId) {
      if (confirm('Are you sure you want to delete this connection?')) {
        this.store.deleteConnection(connectionId)
      }
    }
  },

  mounted() {
    this.store.loadPersistedConnections()
    this.settings = { ...this.store.connectionSettings }
  }
}
</script>