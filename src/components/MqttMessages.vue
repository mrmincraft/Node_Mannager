<template>
  <div class="mqtt-messages">
    <h2>Messages MQTT</h2>
    <ul>
      <li v-for="(message, index) in messages" :key="index">
        <strong>Topic:</strong> {{ message.topic }}<br />
        <strong>Message:</strong> {{ message.payload }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MqttMessages',

  props: {
    messages: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.mqtt-messages {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.mqtt-messages ul {
  list-style: none;
  padding: 0;
}

.mqtt-messages li {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
</style>