import { createStore } from 'vuex'

export default createStore({
  state: {
    expenseTotal: 0,
    creditTotal: 0 
  },
  mutations: {
    setExpenseTotal (state, newExpenseTotal) {
      state.expenseTotal = newExpenseTotal
    },
    setCreditTotal(state, newCreditTotal) {
      state.creditTotal = newCreditTotal
    }
  },
  actions: {
  },
  modules: {
  }
})
