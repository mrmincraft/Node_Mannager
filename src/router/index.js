import { createRouter, createWebHashHistory } from 'vue-router'

// Pages
import DashboardView from '../views/DashboardView.vue'
import NodesView from '../views/NodesView.vue'
import MqttViewerView from '../views/MqttViewerView.vue'

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
    path: '/mqtt',
    name: 'MQTT Viewer',
    component: MqttViewerView
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})