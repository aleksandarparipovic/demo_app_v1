<script lang="ts">
export const clientID = ref('tmon-BGphffvi5Lk5N9GHlisrA918yh4UC3ww');
export const clientSecret = ref('65N3MGG1kGq0uosO');
</script>

<script setup lang="ts">
import { ref } from 'vue';

function handleSubmit() {
  console.log('Client ID:', clientID.value);
  console.log('Client Secret:', clientSecret.value);
}

defineProps<{
  msg: string
}>();
</script>

<template>
  <div class="form-container">
    <h1 class="orange">{{ msg }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="clientID">Client ID</label>
        <input type="text" id="clientID" v-model="clientID" placeholder="Enter your Client ID" />
      </div>
      <div class="input-group">
        <label for="clientSecret">Client Secret</label>
        <input type="text" id="clientSecret" v-model="clientSecret" placeholder="Enter your Client Secret" />
      </div>
    </form>
  </div>
</template>


<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.orange {
  color: #f6a927;
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e6543d;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #f6a927;
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 169, 39, 0.3);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #e6543d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #c94431;
}

@media (min-width: 1024px) {
  .form-container {
    text-align: left;
  }
}
</style>
