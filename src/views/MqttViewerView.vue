<template>
  <div class="mqtt-viewer">
    <div class="viewer-header">
      <div class="title-section">
        <h1>MQTT Viewer</h1>
        <span class="status-badge" :class="connectionStatus">
          {{ connectionStatus }}
        </span>
      </div>
      <p class="subtitle">{{ currentBroker }}</p>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <div class="tab-content">
      <keep-alive>
        <component :is="currentTabComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { useMqttStore } from '../stores/mqttStore'
import MqttConnectionTab from '../components/MqttConnectionTab.vue'
import MqttSubscribeTab from '../components/MqttSubscribeTab.vue'
import MqttPublishTab from '../components/MqttPublishTab.vue'
import MqttMessagesTab from '../components/MqttMessagesTab.vue'
import '../styles/mqtt-utils.css'
import '../styles/MqttViewerView.css'

export default {
  name: 'MqttViewerView',

  components: {
    MqttConnectionTab,
    MqttSubscribeTab,
    MqttPublishTab,
    MqttMessagesTab
  },

  data() {
    return {
      activeTab: 'connection',
      tabs: [
        { id: 'connection', label: 'Connection', icon: '🔌' },
        { id: 'subscribe', label: 'Subscribe', icon: '📨' },
        { id: 'publish', label: 'Publish', icon: '📤' },
        { id: 'messages', label: 'Messages', icon: '💬' }
      ]
    }
  },

  computed: {
    store() {
      return useMqttStore()
    },

    connectionStatus() {
      return this.store.connectionStatus
    },

    currentBroker() {
      const url = this.store.connectionSettings.brokerUrl
      return `Broker: ${url}`
    },

    currentTabComponent() {
      const componentMap = {
        connection: 'MqttConnectionTab',
        subscribe: 'MqttSubscribeTab',
        publish: 'MqttPublishTab',
        messages: 'MqttMessagesTab'
      }
      return componentMap[this.activeTab] || 'MqttConnectionTab'
    }
  }
}
</script>
 