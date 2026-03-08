<script setup>
import { ref, computed, onMounted } from 'vue';
import NodeCard from '../components/NodeCard.vue';
import { useNodeStore } from '../stores/nodesStore.js';
import MqttClient from '../class/Mqtt.js';

const nodeStore = useNodeStore();
const mqttClient = new MqttClient('mqtt://broker.hivemq.com'); // Example broker URL

const showModal = ref(false);
const editingIndex = ref(-1);
const newNode = ref({
  name: '',
  status: 'offline',
  type: 'sensor',
  description: '',
  topic: ''
});

const search = ref('');
const filterType = ref('all');
const filterStatus = ref('all');
const connectionError = ref(false);

const filteredNodes = computed(() => {
  return nodeStore.filteredNodes(filterStatus.value, filterType.value, search.value);
});

onMounted(async () => {
  try {
    await mqttClient.connect(); // Attempt to connect to the MQTT broker
  } catch (error) {
    console.error('Failed to connect to MQTT broker:', error);
    connectionError.value = true; // Set connection error flag
  }
});

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingIndex.value = -1;
  resetForm();
}

function resetForm() {
  newNode.value = {
    name: '',
    status: 'offline',
    type: 'sensor',
    description: '',
    topic: ''
  };
}

function addNode() {
  nodeStore.addNode(newNode.value);
  mqttClient.subscribe(newNode.value.topic); // Subscribe to the topic
  closeModal();
}

function editNode(index) {
  editingIndex.value = index;
  const node = nodeStore.nodes[index];

  newNode.value = {
    name: node.name,
    status: node.status,
    type: node.type,
    description: node.description,
    topic: node.topic
  };

  openModal();
}

function saveNode() {
  nodeStore.editNode(editingIndex.value, newNode.value);
  mqttClient.subscribe(newNode.value.topic); // Update subscription
  closeModal();
}

function removeNode(index) {
  const node = nodeStore.nodes[index];
  mqttClient.unsubscribe(node.topic); // Unsubscribe from the topic
  nodeStore.removeNode(index);
}
</script>

<template>
  <div class="app">
    <div v-if="connectionError" class="error-message">
      <h2>Unable to connect to the MQTT broker. Please check your connection and try again.</h2>
    </div>
    <div v-else>
      <div class="searchBar">
        <input v-model="search" placeholder="Search nodes..." />
        <select v-model="filterType">
          <option value="all">All Types</option>
          <option value="sensor">Sensor</option>
          <option value="actuator">Actuator</option>
        </select>
        <select v-model="filterStatus">
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div class="nodesGrid">
        <div
          v-for="(node, index) in filteredNodes"
          :key="node.id"
          class="node-card"
        >
          <NodeCard :node="node" />
          <button @click="editNode(index)">Edit</button>
          <button @click="removeNode(index)">Delete</button>
        </div>

        <div class="addCard" @click="openModal">
          +
        </div>
      </div>

      <div v-if="showModal" class="overlay" @click.self="closeModal">
        <div class="modal">
          <h2>{{ editingIndex === -1 ? 'Add Node' : 'Edit Node' }}</h2>
          <input v-model="newNode.name" placeholder="Node Name" />
          <select v-model="newNode.type">
            <option value="sensor">Sensor</option>
            <option value="actuator">Actuator</option>
          </select>
          <textarea v-model="newNode.description" placeholder="Description"></textarea>
          <input v-model="newNode.topic" placeholder="MQTT Topic" />

          <div class="actions">
            <button class="cancel" @click="closeModal">Cancel</button>
            <button @click="editingIndex === -1 ? addNode() : saveNode()">
              {{ editingIndex === -1 ? 'Add' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* ====== Container général ====== */
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Inter', sans-serif;
  color: #e9ecef;
  background: #0b0f17;
}


.searchBar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.searchBar input {
  flex: 1;
  height: 44px;
  padding: 0 15px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: #e9ecef;
  outline: none;
  transition: 0.2s;
}

.searchBar input:focus {
  border-color: rgba(124, 211, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(124, 211, 255, 0.18);
}


.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.filters select {
  height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: #e9ecef;
  outline: none;
}


.nodesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
}



.addCard {
  border: 2px dashed rgba(255,255,255,0.20);
  border-radius: 14px;
  font-size: 3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 230px;
  color: rgba(255,255,255,0.7);
  transition: background 0.2s ease, transform 0.2s ease;
}

.addCard:hover {
  background: rgba(255,255,255,0.06);
  transform: translateY(-3px);
}

/* ====== Modal ====== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: rgba(18, 23, 33, 0.92);
  padding: 25px;
  border-radius: 16px;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255,255,255,0.12);
}

.modal h2 {
  margin: 0;
  color: #fff;
}

.modal input,
.modal select,
.modal textarea {
  height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.06);
  color: #fff;
  outline: none;
}

.modal textarea {
  height: 80px;
  resize: none;
  padding-top: 10px;
}

.modal input:focus,
.modal select:focus,
.modal textarea:focus {
  border-color: rgba(124, 211, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(124, 211, 255, 0.18);
}

.actions {
  display: flex;
  justify-content: space-between;
}

.actions button {
  width: 48%;
  height: 42px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.actions .cancel {
  background: rgba(255,255,255,0.12);
  color: #fff;
}

.actions button:hover {
  filter: brightness(1.1);
}
</style>