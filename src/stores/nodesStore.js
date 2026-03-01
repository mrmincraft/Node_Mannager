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

    nodesArray: (state) => Object.values(state.nodes)
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
    }
  }
});
