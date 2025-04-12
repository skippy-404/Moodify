import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false,
    darkMode: localStorage.getItem('darkMode') === 'enabled'
  },
  mutations: {
    setUser(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    },
    setDarkMode(state, enabled) {
      state.darkMode = enabled
      localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled')
    }
  },
  actions: {
    login({ commit }, token) {
      localStorage.setItem('authToken', token)
      // 这里可以添加获取用户信息的逻辑
      commit('setUser', { token })
    },
    logout({ commit }) {
      localStorage.removeItem('authToken')
      commit('setUser', null)
    },
    toggleDarkMode({ commit, state }) {
      commit('setDarkMode', !state.darkMode)
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    currentUser: state => state.user,
    isDarkMode: state => state.darkMode
  }
}) 