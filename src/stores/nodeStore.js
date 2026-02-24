import { defineStore } from 'pinia'
import { Node } from '../class/Node.js'

export const useNodeStore = defineStore('nodeStore', {
  state: () => ({
    nodes: []
  }),

  getters: {
    totalNodes: (state) => state.nodes.length,

    onlineNodes: (state) => state.nodes.filter(n => n.status === 'online'),
    standbyNodes: (state) => state.nodes.filter(n => n.status === 'standby'),
    offlineNodes: (state) => state.nodes.filter(n => n.status === 'offline'),

    sensorNodes: (state) => state.nodes.filter(n => n.type === 'sensor'),
    actuatorNodes: (state) => state.nodes.filter(n => n.type === 'actuator'),

    // exemple de getter qui retourne un objet résumé
    summary: (state) => ({
      total: state.nodes.length,
      online: state.nodes.filter(n => n.status === 'online').length,
      standby: state.nodes.filter(n => n.status === 'standby').length,
      offline: state.nodes.filter(n => n.status === 'offline').length
    }),

    // getter dynamique : recherche par texte
    searchNodes: (state) => {
        return (query) => {
        const q = query.toLowerCase()
        return state.nodes.filter(n =>
          n.name.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.status.toLowerCase().includes(q)
        )
      }
    },
    filteredNodes: (state) => {
        return (status, type, query) => {
        return state.nodes.filter(node => {
            const statusMatch = status === 'all' ? true : node.status === status
            const typeMatch = type === 'all' ? true : node.type === type

            const q = query.toLowerCase().trim()
            const queryMatch = q === '' 
            ? true 
            : (
                node.name.toLowerCase().includes(q) ||
                node.description.toLowerCase().includes(q) ||
                node.type.toLowerCase().includes(q) ||
                node.status.toLowerCase().includes(q)
            )

            return statusMatch && typeMatch && queryMatch
        })
      }
    }
  },

  actions: {
    addNode(node) {
      this.nodes.push(new Node(node.name, node.status, node.type, node.description))
    },

    removeNode(index) {
      this.nodes.splice(index, 1)
    },

    editNode(index, newData) {
      this.nodes[index] = { ...newData }
    }
  }
})