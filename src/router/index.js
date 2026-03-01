import { createRouter, createWebHistory } from 'vue-router'

// Pages
import DashboardView from '../views/DashboardView.vue'
import NodesView from '../views/NodesView.vue'
import NodeDetailView from '../views/NodeDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
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