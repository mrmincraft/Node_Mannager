<template>
  <div class="mqtt-subscribe-tab">
    <div class="subscribe-form">
      <h3>Subscribe to Topics</h3>
      
      <div class="form-row">
        <div class="form-group">
          <label for="topic-input">Topic (supports # and + wildcards)</label>
          <input
            id="topic-input"
            v-model="newTopic"
            type="text"
            placeholder="sensor/temperature/+/data"
            @keyup.enter="subscribeTopic"
            :disabled="!isConnected"
          />
          <small class="hint">
            Use <code>+</code> for single-level wildcard, <code>#</code> for multi-level
          </small>
        </div>

        <div class="form-group">
          <label for="qos-select">QoS Level</label>
          <select
            id="qos-select"
            v-model.number="newQos"
            :disabled="!isConnected"
          >
            <option value="0">0 - At most once</option>
            <option value="1">1 - At least once</option>
            <option value="2">2 - Exactly once</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        @click="subscribeTopic"
        :disabled="!isConnected || !newTopic.trim()"
      >
        Subscribe
      </button>
    </div>

    <div v-if="subscriptions.length > 0" class="subscriptions-list">
      <h3>Active Subscriptions ({{ subscriptions.length }})</h3>
      
      <div class="subscription-item" v-for="sub in subscriptions" :key="sub.topic">
        <div class="subscription-info">
          <div class="topic-name">{{ sub.topic }}</div>
          <div class="subscription-meta">
            <span class="qos-badge" :class="`qos-${sub.qos}`">QoS {{ sub.qos }}</span>
            <span class="message-count">
              {{ getMessageCount(sub.topic) }} messages
            </span>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-danger btn-small"
          @click="unsubscribeTopic(sub.topic)"
        >
          Unsubscribe
        </button>
      </div>
    </div>

    <div v-else class="no-subscriptions">
      <p>No active subscriptions. Subscribe to a topic to start listening.</p>
    </div>
  </div>
</template>

<script>
import { useMqttStore } from '../stores/mqttStore'
import '../styles/mqtt-utils.css'
import '../styles/MqttSubscribeTab.css'

export default {
  name: 'MqttSubscribeTab',

  data() {
    return {
      newTopic: '',
      newQos: 0
    }
  },

  computed: {
    store() {
      return useMqttStore()
    },

    isConnected() {
      return this.store.isConnected
    },

    subscriptions() {
      return this.store.subscriptionList
    }
  },

  methods: {
    subscribeTopic() {
      if (!this.newTopic.trim()) {
        alert('Please enter a topic')
        return
      }

      if (this.store.subscribeTopic(this.newTopic.trim(), this.newQos)) {
        this.newTopic = ''
        this.newQos = 0
      }
    },

    unsubscribeTopic(topic) {
      if (confirm(`Unsubscribe from "${topic}"?`)) {
        this.store.unsubscribeTopic(topic)
      }
    },

    getMessageCount(topic) {
      const messages = this.store.messagesByTopic(topic)
      return messages ? messages.length : 0
    }
  }
}
</script>