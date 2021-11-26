import { createStore } from 'vuex'

export default createStore({
  state: {
    expenseTotal: 0,
    creditTotal: 0,
    isLoggedIn: false
  },
  mutations: {
    setExpenseTotal (state, newExpenseTotal) {
      state.expenseTotal = newExpenseTotal
    },
    setCreditTotal(state, newCreditTotal) {
      state.creditTotal = newCreditTotal
    },
    setLogIn(state, newLogInState) {
      state.isLoggedIn = newLogInState
    }
  },
  actions: {
  },
  modules: {
  }
})
