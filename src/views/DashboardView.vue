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

<style scoped>
@import '../styles/mqtt-utils.css';

.dashboard {
  color: var(--color-text-primary);
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.dashboard h1 {
  font-size: var(--font-2xl);
  color: var(--color-text-primary);
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
}

.card {
  background: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.card:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card h2 {
  font-size: var(--font-lg);
  margin: 0;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.card p {
  font-size: var(--font-2xl);
  font-weight: 700;
  margin: 0;
  color: var(--color-primary);
}

.chart-box {
  margin-top: var(--spacing-lg);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nodes-list {
  margin-top: var(--spacing-lg);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.node-card {
  background: var(--color-bg-tertiary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
  text-align: center;
}

.node-card:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  transform: translateY(-2px);
}

.node-card h3 {
  font-size: var(--font-lg);
  margin: 0;
  color: var(--color-text-primary);
}

.node-card p {
  font-size: var(--font-base);
  margin: 0;
  font-weight: 600;
}

.online {
  color: var(--color-success);
}

.offline {
  color: var(--color-danger);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dashboard {
    padding: var(--spacing-lg) var(--spacing-lg);
  }

  .stats {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .nodes-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-lg) var(--spacing-md);
    gap: var(--spacing-lg);
  }

  .dashboard h1 {
    font-size: var(--font-xl);
  }

  .stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }

  .card {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }

  .card h2 {
    font-size: var(--font-md);
  }

  .card p {
    font-size: var(--font-xl);
  }

  .chart-box {
    min-height: 250px;
    padding: var(--spacing-md);
  }

  .nodes-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-md);
  }

  .node-card {
    padding: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: var(--spacing-md);
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .nodes-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-box {
    min-height: 200px;
  }
}
</style>
