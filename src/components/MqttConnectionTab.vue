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
import { connect, disconnect, publish, subscribe, unsubscribe } from "@kuyoonjo/tauri-plugin-mqtt";

export default {
  name: "MqttConnectionTab",

  data() {
    return {
      settings: {
        brokerUrl: "",
        clientId: "",
        username: "",
        password: "",
      },

      connecting: false,
      connectionNameInput: "",
      mqttClient: null,
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
        if (this.mqttClient) {
          // Disconnect
          await disconnect(this.mqttClient)

          this.mqttClient = null
          this.store.isConnected = false
          this.store.connectionStatus = "Disconnected"

          console.log("Disconnected from broker")
        } else {
          // Connect
          const client = await connect({
            url: this.settings.brokerUrl,
            clientId:
              this.settings.clientId ||
              `tauri-client-${Math.random().toString(16).slice(2)}`,

            username: this.settings.username || undefined,
            password: this.settings.password || undefined,
          })

          this.mqttClient = client

          this.store.isConnected = true
          this.store.connectionStatus = "Connected"

          console.log("Connected to broker")

          // Example subscription
          await subscribe(client, "test/topic", (message) => {
            console.log("Received:", message)
          })

          // Example publish
          await publish(client, "test/topic", "Hello from Tauri MQTT")
        }
      } catch (error) {
        console.error("MQTT connection error:", error)

        this.store.isConnected = false
        this.store.connectionStatus = "Error"
      } finally {
        this.connecting = false
      }
    },

    async subscribeToTopic(topic) {
      if (!this.mqttClient) return

      try {
        await subscribe(this.mqttClient, topic, (message) => {
          console.log(`[${topic}]`, message)
        })

        console.log(`Subscribed to ${topic}`)
      } catch (error) {
        console.error("Subscribe error:", error)
      }
    },

    async unsubscribeFromTopic(topic) {
      if (!this.mqttClient) return

      try {
        await unsubscribe(this.mqttClient, topic)

        console.log(`Unsubscribed from ${topic}`)
      } catch (error) {
        console.error("Unsubscribe error:", error)
      }
    },

    async publishMessage(topic, payload) {
      if (!this.mqttClient) return

      try {
        await publish(this.mqttClient, topic, payload)

        console.log(`Published to ${topic}:`, payload)
      } catch (error) {
        console.error("Publish error:", error)
      }
    },

    saveConnection() {
      const name = prompt("Enter a name for this connection:")

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
      if (confirm("Are you sure you want to delete this connection?")) {
        this.store.deleteConnection(connectionId)
      }
    }
  },

  mounted() {
    this.store.loadPersistedConnections()
    this.settings = { ...this.store.connectionSettings }
  },

  async beforeUnmount() {
    if (this.mqttClient) {
      try {
        await disconnect(this.mqttClient)
      } catch (error) {
        console.error("Cleanup disconnect error:", error)
      }
    }
  }
}
</script>