import mqtt from 'mqtt'

class MqttClient {
  constructor(brokerUrl, options = {}) {
    this.client = mqtt.connect(brokerUrl, options)

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker')
    })

    this.client.on('message', (topic, message) => {
      console.log(`Message received on topic ${topic}:`, message.toString())
      if (this.onMessageCallback) {
        this.onMessageCallback(topic, message.toString())
      }
    })

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error)
    })
  }

  subscribe(topic) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err)
      } else {
        console.log(`Subscribed to topic ${topic}`)
      }
    })
  }

  unsubscribe(topic) {
    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to unsubscribe from topic ${topic}:`, err)
      } else {
        console.log(`Unsubscribed from topic ${topic}`)
      }
    })
  }

  publish(topic, message) {
    this.client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Failed to publish message to topic ${topic}:`, err)
      } else {
        console.log(`Message published to topic ${topic}`)
      }
    })
  }

  setOnMessageCallback(callback) {
    this.onMessageCallback = callback
  }

  disconnect() {
    this.client.end(() => {
      console.log('Disconnected from MQTT broker')
    })
  }
}

export default MqttClient
