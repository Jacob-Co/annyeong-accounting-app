import { createStore } from 'vuex'

export default createStore({
  state: {
    expenseTotal: 0,
    creditTotal: 0,
    stockTotal: 0,
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
    },
    setStockTotal(state, newStockTotal) {
      state.stockTotal = newStockTotal;
    }
  },
  actions: {
  },
  modules: {
  }
})
