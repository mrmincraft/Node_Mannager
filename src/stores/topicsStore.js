import { defineStore } from 'pinia';

export const useTopicsStore = defineStore('topics', {
  state: () => ({
    topics: []
  }),
  actions: {
    addTopic(topic) {
      if (topic.trim()) {
        this.topics.push(topic.trim());
      }
    },
    editTopic(index, newTopic) {
      if (newTopic.trim()) {
        this.topics[index] = newTopic.trim();
      }
    },
    deleteTopic(index) {
      this.topics.splice(index, 1);
    }
  }
});