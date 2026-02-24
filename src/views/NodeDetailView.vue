<script setup>
import { useRoute } from 'vue-router'
import { useNodeStore } from '../stores/nodeStore'

const route = useRoute()
const nodeStore = useNodeStore()

const nodeId = Number(route.params.id)
const node = nodeStore.nodes[nodeId]
</script>

<template>
  <div class="app" v-if="node">
    <h2>{{ node.name }}</h2>
    <p>Status: {{ node.status }}</p>
    <p>Type: {{ node.type }}</p>
    <p>{{ node.description }}</p>
  </div>

  <div v-else class="app">
    <p>Node not found</p>
  </div>
</template>
