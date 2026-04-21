import { defineStore } from "pinia";

export const useNodeStore = defineStore("nodes", {
  state: () => ({
    nodes: {} // { id: { id, activity: [], lastSeen } }
  }),

  getters: {
    totalNodes: (state) => Object.keys(state.nodes).length,

    onlineNodes: (state) =>
      Object.values(state.nodes).filter(
        (n) => Date.now() - n.lastSeen < 5000
      ).length,

    nodesArray: (state) => Object.values(state.nodes),

    filteredNodes: (state) => (status, type, search) => {
      return Object.values(state.nodes).filter((node) => {
        const matchStatus = status === 'all' || node.status === status;
        const matchType = type === 'all' || node.type === type;
        const matchSearch = !search || 
          node.name.toLowerCase().includes(search.toLowerCase()) ||
          node.topic?.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchType && matchSearch;
      });
    }
  },

  actions: {
    updateNode(id, data) {
      if (!this.nodes[id]) {
        this.nodes[id] = { id, activity: [], lastSeen: Date.now() };
      }

      this.nodes[id].activity.push(data.activity);
      this.nodes[id].lastSeen = Date.now();

      if (this.nodes[id].activity.length > 50) {
        this.nodes[id].activity.shift();
      }
    },

    addNode(node) {
      const id = Date.now().toString();
      this.nodes[id] = {
        id,
        name: node.name,
        status: node.status || 'offline',
        type: node.type || 'sensor',
        description: node.description,
        topic: node.topic,
        activity: [],
        lastSeen: Date.now()
      };
    },

    editNode(index, newNode) {
      const nodeArray = Object.values(this.nodes);
      if (nodeArray[index]) {
        const id = nodeArray[index].id;
        this.nodes[id] = {
          ...this.nodes[id],
          name: newNode.name,
          status: newNode.status,
          type: newNode.type,
          description: newNode.description,
          topic: newNode.topic
        };
      }
    },

    removeNode(index) {
      const nodeArray = Object.values(this.nodes);
      if (nodeArray[index]) {
        const id = nodeArray[index].id;
        delete this.nodes[id];
      }
    }
  }
});
