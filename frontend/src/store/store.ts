import { defineStore } from 'pinia';

export const userStore = defineStore('user', {
  state: () => ({
    userId: null,
  }),
  persist: true, 
});