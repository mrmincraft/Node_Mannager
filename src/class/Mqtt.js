import mqtt from 'mqtt'

class MqttClient {
  constructor(brokerUrl, options = {}) {
    this.client = mqtt.connect(brokerUrl, options)
    this.onMessageCallback = null
    this.onConnectCallback = null
    this.onDisconnectCallback = null

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker')
      if (this.onConnectCallback) {
        this.onConnectCallback()
      }
    })

    this.client.on('message', (topic, message, packet) => {
      console.log(`Message received on topic ${topic}:`, message.toString())
      if (this.onMessageCallback) {
        this.onMessageCallback(topic, message.toString(), packet)
      }
    })

    this.client.on('close', () => {
      console.log('Disconnected from MQTT broker')
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback()
      }
    })

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error)
    })
  }

  subscribe(topic, qos = 0) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, { qos }, (err, granted) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err)
          reject(err)
        } else {
          console.log(`Subscribed to topic ${topic}`)
          resolve(granted)
        }
      })
    })
  }

  unsubscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.unsubscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to unsubscribe from topic ${topic}:`, err)
          reject(err)
        } else {
          console.log(`Unsubscribed from topic ${topic}`)
          resolve()
        }
      })
    })
  }

  publish(topic, message, qos = 0, retain = false) {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, message, { qos, retain }, (err) => {
        if (err) {
          console.error(`Failed to publish message to topic ${topic}:`, err)
          reject(err)
        } else {
          console.log(`Message published to topic ${topic}`)
          resolve()
        }
      })
    })
  }

  setOnMessageCallback(callback) {
    this.onMessageCallback = callback
  }

  setOnConnectCallback(callback) {
    this.onConnectCallback = callback
  }

  setOnDisconnectCallback(callback) {
    this.onDisconnectCallback = callback
  }

  disconnect() {
    return new Promise((resolve) => {
      this.client.end(() => {
        console.log('Disconnected from MQTT broker')
        resolve()
      })
    })
  }

  isConnected() {
    return this.client && this.client.connected
  }
}

export default MqttClient
