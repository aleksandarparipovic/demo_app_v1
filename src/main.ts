import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeAuthorizationHeader } from './initAuthorizationHeader';

const app = createApp(App)
app.use(router)
const authorizationHeader = initializeAuthorizationHeader();
app.config.globalProperties.$authorizationHeader = authorizationHeader;
app.mount('#app')
