import { createStore } from 'vuex'

export default createStore({
  state: {
    expenses: [] 
  },
  mutations: {
    setExpenses (state, newExpenses) {
      state.expenses = newExpenses
    }
  },
  getters: {
    getExpenses: state => {
      return state.expenses
    }
  },
  actions: {
  },
  modules: {
  }
})
