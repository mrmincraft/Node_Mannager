<script setup>
import { ref, computed } from 'vue';
import NodeCard from '../components/NodeCard.vue';
import { useNodeStore } from '../stores/nodesStore.js';

const nodeStore = useNodeStore();
const showModal = ref(false);
const editingIndex = ref(-1);
const search = ref('');
const filterType = ref('all');
const filterStatus = ref('all');

const filteredNodes = computed(() => {
  return nodeStore.filteredNodes(filterStatus.value, filterType.value, search.value);
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

const newNode = ref({
  name: '',
  status: 'offline',
  type: 'sensor',
  description: '',
  topic: ''
});

function addNode() {
  nodeStore.addNode(newNode.value);
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
  closeModal();
}

function removeNode(index) {
  nodeStore.removeNode(index);
}
</script>

<template>
  <div class="app">
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
          <select v-model="newNode.status">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
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
</template>


<style scoped>
@import '../styles/mqtt-utils.css';

/* Container */
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Search and Filter Bar */
.searchBar {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  align-items: center;
  flex-wrap: wrap;
}

.searchBar input,
.searchBar select {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text-primary);
  outline: none;
  transition: var(--transition);
  font-size: var(--font-base);
  font-family: var(--font-mono);
}

.searchBar input {
  flex: 1;
  min-width: 150px;
  height: 2.75rem;
  padding: var(--spacing-sm) var(--spacing-md);
}

.searchBar select {
  height: 2.75rem;
  padding: var(--spacing-xs) var(--spacing-md);
  min-width: 120px;
}

.searchBar input:hover,
.searchBar select:hover {
  border-color: rgba(124, 211, 255, 0.5);
}

.searchBar input:focus,
.searchBar select:focus {
  border-color: rgba(124, 211, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(124, 211, 255, 0.18);
}

/* Nodes Grid */
.nodesGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  flex: 1;
  overflow-y: auto;
}

.node-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.node-card button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-sm);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 600;
  background-color: var(--color-primary);
  color: #fff;
}

.node-card button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* Add Card */
.addCard {
  border: 2px dashed var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: 3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 230px;
  color: rgba(255, 255, 255, 0.7);
  transition: var(--transition);
  font-weight: 700;
}

.addCard:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-3px);
  border-color: var(--color-primary);
}

/* Modal Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
}

.modal {
  background: rgba(18, 23, 33, 0.92);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  border: 1px solid rgba(255, 255, 255, 0.12);
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0;
  color: #fff;
  font-size: var(--font-lg);
}

.modal input,
.modal select,
.modal textarea {
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  outline: none;
  transition: var(--transition);
  font-family: var(--font-family);
  font-size: var(--font-base);
  min-height: 2.5rem;
}

.modal input:hover:not(:disabled),
.modal select:hover:not(:disabled),
.modal textarea:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.25);
}

.modal input:focus,
.modal select:focus,
.modal textarea:focus {
  border-color: rgba(124, 211, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(124, 211, 255, 0.18);
}

.modal textarea {
  min-height: 100px;
  resize: vertical;
  padding-top: var(--spacing-sm);
}

/* Modal Actions */
.actions {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.actions button {
  flex: 1;
  height: 2.75rem;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: var(--font-base);
  transition: var(--transition);
}

.actions .cancel {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.actions .cancel:hover {
  background: rgba(255, 255, 255, 0.18);
  filter: brightness(1.1);
}

.actions button:not(.cancel) {
  background: var(--color-primary);
  color: #fff;
}

.actions button:not(.cancel):hover {
  background: var(--color-primary-dark);
  filter: brightness(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nodesGrid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .app {
    padding: var(--spacing-lg) var(--spacing-md);
    gap: var(--spacing-md);
  }

  .searchBar {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .searchBar input,
  .searchBar select {
    width: 100%;
  }

  .nodesGrid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .modal {
    max-width: 90%;
    padding: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .app {
    padding: var(--spacing-md);
  }

  .searchBar {
    gap: var(--spacing-xs);
  }

  .nodesGrid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .modal {
    width: 95%;
    padding: var(--spacing-lg);
  }

  .addCard {
    font-size: 2rem;
    min-height: 180px;
  }
}</style>