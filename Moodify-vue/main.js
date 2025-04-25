import { createApp } from 'vue'
import App from './App.vue'
import router from './src/router'
import store from './src/store'
import './assets/styles/main.css'
import './assets/styles/dark-mode.css'

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
