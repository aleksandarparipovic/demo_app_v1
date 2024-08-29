<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Home from './components/Home.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/lotusflare_logo.svg" />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100vw; /* Adjust to avoid horizontal scroll */
  height: 100vh;
  box-sizing: border-box; /* Include padding and border in width/height */
  overflow: hidden; /* Prevent overflow that causes scrolling */
}

header {
  width: 100px; /* Fixed width for the header */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  border-right: 1px solid #ddd;
}

.logo {
  width: 80px;
  height: auto;
}

main {
  flex-grow: 1; /* Main content takes up the remaining space */
  overflow-y: auto;
  padding: 1rem;
  background-color: #ffffff;
}
</style>
