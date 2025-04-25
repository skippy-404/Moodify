<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    
    const isAuthenticated = computed(() => store.getters.isAuthenticated)
    const isDarkMode = computed(() => store.getters.isDarkMode)
    
    const toggleDarkMode = () => {
      store.dispatch('toggleDarkMode')
    }

    return {
      isAuthenticated,
      isDarkMode,
      toggleDarkMode
    }
  }
}
</script>

<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <nav class="top-nav">
      <div class="brand">
        <div class="brand-logo">
          <span>M</span>
        </div>
        <div class="brand-name">Moodify</div>
      </div>
      
      <div class="nav-items">
        <router-link to="/" class="top-item">
          <span class="top-text">Home</span>
        </router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="top-item">
          <span class="top-text">Login</span>
        </router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="top-item">
          <span class="top-text">Register</span>
        </router-link>
        <router-link v-if="isAuthenticated" to="/profile" class="top-item">
          <span class="top-text">Profile</span>
        </router-link>
        <router-link v-if="isAuthenticated" to="/community" class="top-item">
          <span class="top-text">Community</span>
        </router-link>
      </div>

      <button class="theme-toggle" @click="toggleDarkMode">
        <span class="material-symbols-outlined">
          {{ isDarkMode ? 'light_mode' : 'dark_mode' }}
        </span>
      </button>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style>
@import 'src/assets/styles/main.css';
</style>
