<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'

const users = ref([])

const showModal = ref(false)

const newUser = ref({
  name: '',
  age: null,
  email: '',
  role: 'user',
  avatar: ''
})

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  newUser.value.avatar = URL.createObjectURL(file)
}

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function addUser() {
  users.value.push({ ...newUser.value })
  closeModal()
  newUser.value = {
    name: '',
    age: null,
    email: '',
    role: 'user',
    avatar: {}
  }
}

function removeUser(index) {
  users.value.splice(index, 1)
}
</script>

<template>
  <div class="usersGrid">
    <UserCard
      v-for="(user, index) in users"
      :key="index"
      v-bind="user"
      @delete="removeUser(index)"
    />

    <!-- ADD CARD -->
    <div class="addCard" @click="openModal">
      +
    </div>
  </div>

  <!-- MODAL -->
  <div v-if="showModal" class="overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Add a Swarm member</h2>

      <input v-model="newUser.name" placeholder="Nom" />
      <input v-model.number="newUser.age" type="number" placeholder="Age" />
      <input v-model="newUser.email" placeholder="Email" />
      <input type="file" accept="image/*" @change="handleImageUpload" />
      <img v-if="newUser.avatar" :src="newUser.avatar" class="preview"/>

      <select v-model="newUser.role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div class="actions">
        <button @click="addUser">Créer</button>
        <button class="cancel" @click="closeModal">Annuler</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usersGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.addCard {
  border: 2px dashed #aaa;
  border-radius: 10px;
  font-size: 3rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  color: #777;
}

.addCard:hover {
  background: #f5f5f5;
}

/* MODAL */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.07);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: rgba(255, 255, 255, 0.3);
  padding: 25px;
  border-radius: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.cancel {
  background: #cccccccc;
}
</style>