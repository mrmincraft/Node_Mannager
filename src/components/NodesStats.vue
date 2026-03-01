<template>
  <div class="stats-container">
    <h2>Total Nodes: {{ totalNodes }}</h2>

    <div class="chart-box">
      <LineChart :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

export default {
  name: "NodesStats",
  components: { LineChart },

  props: {
    nodes: Array, // ex: [{id:1, activity: [1,2,3]}, ...]
  },

  computed: {
    totalNodes() {
      return this.nodes.length
    },

    chartData() {
      return {
        labels: this.nodes[0]?.activity.map((_, i) => `T${i}`) || [],
        datasets: this.nodes.map((node, index) => ({
          label: `Node ${node.id}`,
          data: node.activity,
          borderColor: this.randomColor(index),
          tension: 0.3
        }))
      }
    }
  },

  methods: {
    randomColor(i) {
      const colors = ["#00c16a", "#4ade80", "#22c55e", "#16a34a"]
      return colors[i % colors.length]
    }
  },

  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { labels: { color: "#e6e6e6" } }
        },
        scales: {
          x: { ticks: { color: "#c9c9c9" } },
          y: { ticks: { color: "#c9c9c9" } }
        }
      }
    }
  }
}
</script>

<style>
.stats-container {
  background: #202325;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid #2a2d2f;
}

.stats-container h2 {
  color: #00c16a;
  margin-bottom: 1rem;
}

.chart-box {
  background: #1b1d1f;
  padding: 1rem;
  border-radius: 8px;
}
</style>
