<template>
  <div class="dashboard">
    <h1>MQTT Dashboard</h1>

    <div class="stats">
      <div class="card">
        <h2>Total Nodes</h2>
        <p>{{ nodesStore.totalNodes }}</p>
      </div>

      <div class="card">
        <h2>Online</h2>
        <p>{{ nodesStore.onlineNodes }}</p>
      </div>

      <div class="card">
        <h2>Current Node Count</h2>
        <p>{{ nodesStore.nodesArray.length }}</p>
      </div>
    </div>

    <div class="chart-box">
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <div class="nodes-list">
      <div
        v-for="node in nodesStore.nodesArray"
        :key="node.id"
        class="node-card"
      >
        <h3>Node {{ node.id }}</h3>
        <p :class="isOnline(node) ? 'online' : 'offline'">
          {{ isOnline(node) ? "Online" : "Offline" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Pie } from "vue-chartjs";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { useNodeStore } from "../stores/nodesStore";

Chart.register(ArcElement, Tooltip, Legend);

export default {
  components: { Pie },

  setup() {
    const nodesStore = useNodeStore();
    return { nodesStore };
  },

  computed: {
    chartData() {
      return {
        labels: this.nodesStore.nodesArray.map(node => `Node ${node.id}`),

        datasets: [
          {
            label: "Activity distribution",
            data: this.nodesStore.nodesArray.map(node =>
              node.activity.reduce((a, b) => a + b, 0)
            ),
            backgroundColor: [
              "#00c16a",
              "#4ade80",
              "#22c55e",
              "#16a34a",
              "#15803d",
              "#0f5132"
            ]
          }
        ]
      };
    }
  },

  methods: {
    isOnline(node) {
      return Date.now() - node.lastSeen < 5000;
    }
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#e6e6e6" }
          }
        }
      }
    };
  }
};
</script>

<style>
.dashboard {
  color: #e6e6e6;
}

.stats {
  display: flex;
  gap: 1rem;
}

.card {
  background: #202325;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2d2f;
}

.chart-box {
  margin-top: 2rem;
  background: #1b1d1f;
  padding: 1rem;
  border-radius: 8px;
}

.nodes-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.node-card {
  background: #202325;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2d2f;
}

.online {
  color: #00c16a;
}

.offline {
  color: #ff4d4d;
}
</style>
