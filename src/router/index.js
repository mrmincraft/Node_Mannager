import { createRouter, createWebHistory } from 'vue-router'

// Pages
import HomeView from '../views/HomeView.vue'
import NodesView from '../views/NodesView.vue'
import NodeDetailView from '../views/NodeDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/nodes',
    name: 'nodes',
    component: NodesView
  },
  {
    path: '/nodes/:id',
    name: 'node-detail',
    component: NodeDetailView,
    props: true
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})