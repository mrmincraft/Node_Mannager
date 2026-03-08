import { createRouter, createWebHistory } from 'vue-router'

// Pages
import DashboardView from '../views/DashboardView.vue'
import NodesView from '../views/NodesView.vue'
import NodeDetailView from '../views/NodeDetailView.vue'
import TopicsView from '../views/TopicsView.vue'

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
    path: '/topics',
    name: 'Topics',
    component: TopicsView
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})