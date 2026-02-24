<script setup>
import { ref, computed } from 'vue'
import NodeCard from '../components/NodeCard.vue'
import { useNodeStore } from '../stores/nodestore.js'

const nodeStore = useNodeStore()

const showModal = ref(false)
const editingIndex = ref(-1)

const newNode = ref({
  name: '',
  status: 'offline',
  type: 'sensor',
  description: ''
})

const search = ref('')
const filterType = ref('all')
const filterStatus = ref('all')

const filteredNodes = computed(() => {
  return nodeStore.filteredNodes(filterStatus.value, filterType.value, search.value)
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingIndex.value = -1
  resetForm()
}

function resetForm() {
  newNode.value = {
    name: '',
    status: 'offline',
    type: 'sensor',
    description: ''
  }
}

function addNode() {
  nodeStore.addNode(newNode.value)
  closeModal()
}

function editNode(index) {
  editingIndex.value = index
  const node = nodeStore.nodes[index]

  newNode.value = {
    name: node.name,
    status: node.status,
    type: node.type,
    description: node.description
  }

  openModal()
}

function saveNode() {
  nodeStore.editNode(editingIndex.value, newNode.value)
  closeModal()
}

function removeNode(index) {
  nodeStore.removeNode(index)
}
</script>


<template>
  <div class="app">
    <div class="searchBar">
      <input v-model="search" placeholder="Search nodes..." />
    </div>

    <div class="filters">
      <select v-model="filterStatus">
        <option value="all">All Status</option>
        <option value="online">Online</option>
        <option value="standby">Standby</option>
        <option value="offline">Offline</option>
      </select>

      <select v-model="filterType">
        <option value="all">All Types</option>
        <option value="sensor">Sensor</option>
        <option value="actuator">Actuator</option>
      </select>
    </div>
  <div class="nodesGrid">
    <NodeCard
      v-for="(node, index) in filteredNodes"
      :key="index"
      v-bind="node"
      @go_to="router.push('/node/$(index)')"
      @delete="removeNode(index)"
      @edit="editNode(index)"
    />

    <div class="addCard" @click="openModal">+</div>
  </div>

  <div v-if="showModal" class="overlay" @click.self="closeModal">
    <div class="modal">
      <h2>{{ editingIndex === -1 ? 'Add a Node' : 'Edit Node' }}</h2>

      <input v-model="newNode.name" placeholder="Name" />

      <select v-model="newNode.status">
        <option value="online">online</option>
        <option value="standby">standby</option>
        <option value="offline">offline</option>
      </select>

      <select v-model="newNode.type">
        <option value="sensor">sensor</option>
        <option value="actuator">actuator</option>
      </select>

      <textarea v-model="newNode.description" placeholder="Description"></textarea>

      <div class="actions">
        <button v-if="editingIndex === -1" @click="addNode">Create</button>
        <button v-else @click="saveNode">Save</button>
        <button class="cancel" @click="closeModal">Cancel</button>
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