<template>
  <div class="topics-view">
    <h1>Manage MQTT Topics</h1>
    <div class="topic-form">
      <h2>Add Topic</h2>
      <form @submit.prevent="addTopic">
        <input v-model="newTopic" placeholder="Enter topic name" />
        <button type="submit">Add</button>
      </form>
    </div>

    <div class="topic-list">
      <h2>Topics</h2>
      <ul>
        <li v-for="(topic, index) in topics" :key="index">
          <span>{{ topic }}</span>
          <button @click="editTopic(index)">Edit</button>
          <button @click="deleteTopic(index)">Delete</button>
        </li>
      </ul>
    </div>

    <div v-if="editingIndex !== null" class="overlay" @click.self="cancelEdit">
      <div class="modal">
        <h2>Edit Topic</h2>
        <form @submit.prevent="updateTopic">
          <input v-model="editedTopic" placeholder="Edit topic name" />
          <div class="actions">
            <button class="cancel" @click="cancelEdit">Cancel</button>
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useTopicsStore } from '../stores/topicsStore';

export default {
  name: 'TopicsView',
  setup() {
    const topicsStore = useTopicsStore();

    const addTopic = () => {
      topicsStore.addTopic(newTopic.value);
      newTopic.value = '';
    };

    const editTopic = (index) => {
      editingIndex.value = index;
      editedTopic.value = topicsStore.topics[index];
    };

    const updateTopic = () => {
      topicsStore.editTopic(editingIndex.value, editedTopic.value);
      editingIndex.value = null;
      editedTopic.value = '';
    };

    const deleteTopic = (index) => {
      topicsStore.deleteTopic(index);
    };

    const cancelEdit = () => {
      editingIndex.value = null;
      editedTopic.value = '';
    };

    const newTopic = ref('');
    const editingIndex = ref(null);
    const editedTopic = ref('');

    return {
      topics: topicsStore.topics,
      newTopic,
      editingIndex,
      editedTopic,
      addTopic,
      editTopic,
      updateTopic,
      deleteTopic,
      cancelEdit
    };
  }
};
</script>

<style scoped>
/* General styling for the topics view */
.topics-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Inter', sans-serif;
  color: #e9ecef;
  background: #0b0f17;
}

/* Form styling */
.topic-form {
  margin-bottom: 20px;
  background: #202325;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2d2f;
}

input {
  margin-right: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #e9ecef;
  outline: none;
  transition: 0.2s;
}

input:focus {
  border-color: rgba(124, 211, 255, 0.8);
  box-shadow: 0 0 0 3px rgba(124, 211, 255, 0.18);
}

button {
  margin-left: 5px;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #00c16a;
  color: #0f0f0f;
  transition: 0.2s;
}

button:hover {
  background: #22c55e;
}

/* List styling */
.topic-list ul {
  list-style-type: none;
  padding: 0;
}

.topic-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background: #202325;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #2a2d2f;
}

.topic-list li span {
  color: #e9ecef;
}

.topic-list li button {
  margin-left: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
  .topics-view {
    padding: 20px 10px;
  }

  .topic-list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .topic-list li button {
    margin-left: 0;
    margin-top: 5px;
  }
}

/* Modal styling */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: rgba(18, 23, 33, 0.92);
  padding: 25px;
  border-radius: 16px;
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.modal h2 {
  margin: 0;
  color: #fff;
}

.modal input {
  height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  outline: none;
}

.modal input:focus {
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
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.actions button:hover {
  filter: brightness(1.1);
}
</style>
