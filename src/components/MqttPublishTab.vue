<template>
  <div class="mqtt-publish-tab">
    <div class="publish-form">
      <h3>Publish Message</h3>

      <div class="form-group">
        <label for="pub-topic">Topic</label>
        <input
          id="pub-topic"
          v-model="publishTopic"
          type="text"
          placeholder="sensor/temperature/room1"
          :disabled="!isConnected"
        />
      </div>

      <div class="form-group">
        <label for="pub-message">Message Payload</label>
        <textarea
          id="pub-message"
          v-model="publishMessage"
          placeholder='{"temperature": 22.5, "humidity": 65}'
          :disabled="!isConnected"
          rows="8"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="pub-qos">QoS Level</label>
          <select
            id="pub-qos"
            v-model.number="publishQos"
            :disabled="!isConnected"
          >
            <option value="0">0 - At most once</option>
            <option value="1">1 - At least once</option>
            <option value="2">2 - Exactly once</option>
          </select>
        </div>

        <div class="form-group">
          <label for="pub-retain" class="checkbox-label">
            <input
              id="pub-retain"
              v-model="publishRetain"
              type="checkbox"
              :disabled="!isConnected"
            />
            Retain Message
          </label>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        @click="handlePublish"
        :disabled="!isConnected || !publishTopic.trim()"
      >
        Publish
      </button>

      <div v-if="lastPublished" class="last-published">
        <span class="success-badge">✓ Published</span>
        <small>{{ lastPublished }}</small>
      </div>
    </div>

    <div class="message-templates">
      <h3>Quick Templates</h3>
      <div class="template-list">
        <button
          v-for="template in templates"
          :key="template.id"
          type="button"
          class="template-btn"
          @click="loadTemplate(template)"
          :disabled="!isConnected"
        >
          {{ template.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useMqttStore } from '../stores/mqttStore'
import '../styles/mqtt-utils.css'
import '../styles/MqttPublishTab.css'

export default {
  name: 'MqttPublishTab',

  data() {
    return {
      publishTopic: '',
      publishMessage: '',
      publishQos: 0,
      publishRetain: false,
      lastPublished: null,
      templates: [
        {
          id: 1,
          name: 'JSON',
          topic: 'sensor/data',
          message: JSON.stringify(
            { temperature: 22.5, humidity: 65, timestamp: new Date().toISOString() },
            null,
            2
          )
        },
        {
          id: 2,
          name: 'Plain Text',
          topic: 'messages/status',
          message: 'online'
        },
        {
          id: 3,
          name: 'Numeric',
          topic: 'sensor/temperature',
          message: '22.5'
        }
      ]
    }
  },

  computed: {
    store() {
      return useMqttStore()
    },

    isConnected() {
      return this.store.isConnected
    }
  },

  methods: {
    async handlePublish() {
      if (!this.publishTopic.trim()) {
        alert('Please enter a topic')
        return
      }

      if (this.store.publishMessage(
        this.publishTopic.trim(),
        this.publishMessage,
        this.publishQos,
        this.publishRetain
      )) {
        this.lastPublished = `${this.publishTopic} at ${new Date().toLocaleTimeString()}`
        setTimeout(() => {
          this.lastPublished = null
        }, 3000)
      }
    },

    loadTemplate(template) {
      this.publishTopic = template.topic
      this.publishMessage = template.message
    }
  }
}
</script>