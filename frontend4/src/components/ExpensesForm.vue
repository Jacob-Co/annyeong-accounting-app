<template>
  <div>
    
    <div class="spinner-border text-primary" role="status" v-show="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>
    
    <form class="d-flex-column align-items-start" v-show="!isLoading">

      <div class="d-flex flex-wrap" v-show="isLoading">

        <select
          id="expenseTypeSelect"
          class="form-select d-block" 
          aria-label="Default select example"
          v-model="expenseTypeInput"
        >
          <option selected disabled value="">Expense Type</option>
          <option 
            v-for="expenseType in expenseTypes" 
            :key="expenseType._id"
            :value="expenseType._id.toString()"
          >
            {{expenseType.type}}
          </option>
        </select>

        <div class="input-group">
          <span class="input-group-text">Price</span>
          <input 
            class="form-control" 
            type="number" 
            placeholder="0"
            v-model="priceInput"
          />
          <span class="input-group-text">php</span>
        </div>

        <div class="input-group" id="remarks">
          <input 
            class="form-control" 
            type="string" 
            placeholder="remarks"
            v-model="remarksInput"
          />
        </div>
      </div>

      <div class="d-flex">
        <button 
          type="submit" 
          class="btn-primary btn align-self-start"
          @click="submit"
          style="marginRight: 1rem"
        >
          Add
        </button>

        <button
          type="submit"
          class="btn btn-warning"
          @click="deductFromDaily"
        >
          Deduct From Daily
        </button>
      </div>
    </form>

    <h4>Total: {{totalExpenses}}</h4>
    <h4 class="text-danger">
      Deducted from daily: {{totalDeductedExpenses}}
    </h4>
    <ul class="list-group">
      <li
        v-for="expense in expenses"
        :key="expense._id"
        class="list-group-item"
        aria-label="test"
      >
        <details>
          <summary>
            {{expense.expenseType}}: {{expense.price}}
            <span 
              v-if="expense.isDeductingFromDaily"
              class="text-danger"
            >
              Deducting from daily
            </span>
          <button
            class="btn text-white bg-danger d-inline"
            @click="deleteExpense($event, expense._id)"
          >
          X
          </button>
          </summary>
          {{expense.remarks || 'No remarks'}}
          
        </details>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import { backendString } from '../utils/server.util';
  import { getBearerToken } from '../utils/authorization.util';
  import { getDateTodayInYMD } from '../utils/date.util';
  import store from '../store/index';
  import { subscribe } from '../utils/pubSub.util';

  @Options({})
  export default class ExpenseForm extends Vue {
    public expenseTypes = [];
    public priceInput = NaN;
    public expenseTypeInput = '';
    public remarksInput = '';
    public isLoading = false;
    public expenses = [];
    public totalExpenses = 0;
    public totalDeductedExpenses = 0;
    public changeDateEventListener?: any;

    mounted() {
      this.getExpenseTypes().then(res => this.expenseTypes = res);
      this.setUp();

      this.changeDateEventListener = subscribe('changeDate', this.setUp)
    }

    beforeUnmount() {
      this.changeDateEventListener.unsubscribe();
    }

    private async setUp() {
      this.isLoading = true;
      await this.setTodayExpenses();
      this.isLoading = false;
    }
    
    public async deductFromDaily(e: Event) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendNewExpense(true);
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.setTodayExpenses();
      this.isLoading = false;
      this.resetInputs(); 
    }

    private async setTodayExpenses() {
      this.getTodaysExpenses().then((res) => {
        this.expenses = res;
        this.totalExpenses = 0;
        this.totalDeductedExpenses = 0;
        //@ts-ignore
        res.forEach(expense => {
          this.totalExpenses += expense['price']
          if (expense['isDeductingFromDaily']) {
            this.totalDeductedExpenses += expense['price'];
          }
        })
        store.commit('setExpenseTotal', this.totalDeductedExpenses);
      });
    }

    private async getTodaysExpenses() {
      const unixStart = new Date(store.state.dateUnix).getTime();
      const unixOneDayInMS = 86400 * 1000;
      const unixEnd = unixStart + unixOneDayInMS - 1; 

      const url = `${backendString}/api/expenses/${unixStart}/${unixEnd}/0`;

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return await result.json();
    }

    private async getExpenseTypes() {
      const result = await fetch(`${backendString}/api/expenseTypes/all`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken() 
        },
      })
      return await result.json();
    }

    private async sendNewExpense(isDeducting: boolean = false) {
      if (Number.isNaN(this.priceInput) || this.expenseTypeInput === "") {
        alert('Missing price or expense type');
        return { status: 400}
      }
      
      const body = {
        date: store.state.dateUnix,
        expenseType: this.expenseTypeInput,
        price: this.priceInput * -1,
        remarks: this.remarksInput,
        isDeductingFromDaily: isDeducting
      };
      const result = await fetch(`${backendString}/api/expenses/`, {
        method: 'POST',
        headers: {
          'Authorization': getBearerToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newExpense: body}) 
      });
      return await result;
    }

    private resetInputs() {
      this.priceInput = NaN;
      this.expenseTypeInput = '';
      this.remarksInput = '';
    }

    public async submit(e: Event) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendNewExpense();
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.setTodayExpenses();
      this.isLoading = false;
      this.resetInputs(); 
    }

    private async sendDeleteExpense(id: string) {
      const result = await fetch(`${backendString}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return result;
    }

    public async deleteExpense(e: Event, key: string) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendDeleteExpense(key);

      if (result.status !== 200) {
        alert('Error in deleting expense');
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
      await this.setTodayExpenses();
      return;
    }
  }
</script>

<style scoped>
</style>