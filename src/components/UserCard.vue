<script setup>
defineProps({
  name: String,
  age: Number,
  email: String,
  role: String,
  avatar: String
})

const emit = defineEmits(['delete'])

</script>

<template>
  <div class="userCard">
    <img v-if="avatar" :src="avatar" />
    <h3>{{ name }}</h3>
    <p>{{ age }} ans</p>
    <p>{{ email }}</p>
    <span class="badge">{{ role }}</span>

    <button class="delete" @click="emit('delete')">Supprimer</button>
  </div>
</template>

<style scoped>
.userCard {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.delete {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
