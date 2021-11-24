import { createStore } from 'vuex'

export default createStore({
  state: {
    expenses: [],
    creditTotal: 0 
  },
  mutations: {
    setExpenses (state, newExpenses) {
      state.expenses = newExpenses
    },
    setCreditTotal(state, newCreditTotal) {
      state.expenses = newCreditTotal
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
