<script setup>

const emit = defineEmits(['delete', 'edit', 'go_to'])
const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})


</script>

<template>
  <div class="nodeCard" @dblclick="$emit('go_to')">
    <h3>{{ props.node.name }}</h3>
    <p>Status: <span :class="props.node.status">{{ props.node.status }}</span></p>
    <p>Type: {{ props.node.type }}</p>
    <p>{{ props.node.description }}</p>
    <div class="actions">
      <button class="edit" @click="$emit('edit')">Edit</button>
      <button class="delete" @click="$emit('delete')">Delete</button>
    </div>
  </div>
</template>

<style scoped>
/* ====== Cards ====== */
.nodeCard {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  padding: 16px;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nodeCard:hover {
  transform: translateY(-3px);
  border-color: rgba(124, 211, 255, 0.35);
  background: rgba(255,255,255,0.08);
}

.nodeCard h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #fff;
}

.nodeCard p {
  margin: 6px 0;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
}

/* ====== Status badge ====== */
.status {
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  display: inline-block;
}

.online {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.standby {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.offline {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

/* ====== Boutons ====== */
.nodeCard button {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.nodeCard button:hover {
  filter: brightness(1.1);
}

.nodeCard .edit {
  background: rgba(124, 211, 255, 0.2);
  color: #7dd3fc;
}

.nodeCard .delete {
  background: rgba(248, 113, 113, 0.2);
  color: #fb7185;
}
</style>