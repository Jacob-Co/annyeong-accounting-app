<template>
  <div>
    
    <div class="spinner-border text-primary" role="status" v-show="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>
    
    <form class="d-flex-column align-items-start" v-show="!isLoading">

      <div class="d-flex flex-wrap" v-show="isLoading">

        <input
          type="date"
          v-model="dateInput"
          disabled
        />

        <select
          id="expenseTypeSelect"
          class="form-select d-block" 
          aria-label="Default select example"
          v-model="expenseTypeInput"
        >
          <option selected disabled value="">Expnese Type</option>
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
        >
          Add
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import { backendString } from '../utils/server.util';
  import { getBearerToken } from '../utils/authorization.util';
  import { getDateTodayInYMD } from '../utils/date.util';

  @Options({})
  export default class ExpenseForm extends Vue {
    public expenseTypes = [];
    public dateInput = getDateTodayInYMD();
    public priceInput = NaN;
    public expenseTypeInput = '';
    public remarksInput = '';
    public isLoading = false;

    mounted() {
     this.getExpenseTypes().then(res => this.expenseTypes = res) 
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

    private async sendNewExpense() {
      const body = [{
        date: new Date(this.dateInput).getTime(),
        expenseType: this.expenseTypeInput,
        price: this.priceInput,
        remarks: this.remarksInput
      }];
      const result = await fetch(`${backendString}/api/expenses/batch`, {
        method: 'POST',
        headers: {
          'Authorization': getBearerToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newExpenses: body}) 
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
      this.isLoading = false;
      this.resetInputs(); 
    }

  }
</script>

<style scoped>
</style>