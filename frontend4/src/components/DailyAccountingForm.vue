<template>
  <div>
    <div class="spinner-border text-primary" role="status" v-show="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-show="isAccomplished">
      <h4>Daily Accounting:</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          aria-label="test"
          v-for="dailyAccounting in dailyAccountings"
          :key="dailyAccounting._id"
        >
          <div class="card">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Total Sales: {{dailyAccounting.totalSales}}</li>
              <li class="list-group-item">Online Sales: {{dailyAccounting.onlineSales}}</li>
              <li class="list-group-item">Physical Sales: {{dailyAccounting.physicalSales}}</li>
              <li class="list-group-item">Total Deductions: {{dailyAccounting.totalDeductions}}</li>
              <li class="list-group-item">Net Sales: {{dailyAccounting.netSales}}</li>
              <li class="list-group-item">Net Cash: {{dailyAccounting.netCash}}</li>
              <li class="list-group-item">Credits: {{dailyAccounting.credits}}</li>
              <li class="list-group-item">Take Home: {{dailyAccounting.takeHome}}</li>
              <li class="list-group-item">Cash in Register: {{dailyAccounting.cashInRegister}}</li>
              <li class="list-group-item">Remarks: {{dailyAccounting.remarks}}</li>
            </ul>
          </div>
          <button 
            class="bg-danger btn text-white" 
            @click="deleteForm($event, dailyAccounting._id)"
          >
            Delete
          </button>
        </li>
      </ul>
    </div>

    <form v-show="!isLoading && !isAccomplished">

      <div class="input-group">
        <span class="input-group-text">Total</span>
        <input
          class="form-control"
          type="number"
          @keypress="calculatePhysicalSales"
          v-model="totalSalesInput"
          ref="tsInput"
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Online</span>
        <input
          class="form-control"
          type="number"
          @keypress="calculatePhysicalSales"
          v-model="onlineSalesInput"
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Physical</span>
        <input
          class="form-control"
          type="number"
          v-model="computePhysicalSales"
          disabled
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Total Deduction</span>
        <input
          class="form-control"
          type="number"
          disabled
          v-model="computeTotalDeductions"
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text bg-info">Net Sales</span>
        <input
          class="form-control"
          type="number"
          v-model="computeNetSales"
          disabled
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text bg-warning">Net Cash</span>
        <input
          class="form-control"
          type="number"
          disabled
          placeholder="0"
          v-model="computeNetCash"
         />
         <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Credit</span>
        <input
          class="form-control"
          type="number"
          disabled
          v-model="computeCredits"
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text bg-success text-white">Take Home</span>
        <input
          class="form-control"
          type="number"
          disabled
          placeholder="0"
          v-model="computeTakeHome"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Register</span>
        <input
          class="form-control"
          type="number"
          placeholder="0"
          v-model="cashInRegisterInput"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Remarks:</span>
        <input
          class="form-control"
          type="text"
          v-model="remarksInput"
        />
      </div>

      <button 
        type="submit" 
        class="btn btn-primary"
        @click="submit"
      >
        Add
      </button>
    </form>
  </div>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import store from '../store/index';
  import { backendString } from '../utils/server.util';
  import { getBearerToken } from '../utils/authorization.util';
  import { getDateTodayInYMD } from '../utils/date.util';
  import { subscribe } from '../utils/pubSub.util';

  @Options({
    computed: {
      computePhysicalSales() {
        this.physicalSales = this.totalSalesInput - this.onlineSalesInput;
        return this.physicalSales;
      },
      computeTotalDeductions() {
        this.totalDeductions = store.state.expenseTotal + store.state.stockTotal
        return this.totalDeductions;
      },
      computeExpensesDeductions() {
        this.expensesDeductions = store.state.expenseTotal;
        return this.expensesDeductions;
      },
      computeStocksDeductions() {
        this.stocksDeductions = store.state.stockTotal;
        return this.stocksDeductions;
      },
      computeNetCash() {
        this.netCash = this.physicalSales + this.totalDeductions;
        return this.netCash;
      },
      computeNetSales() {
        this.netSales = this.totalSalesInput + this.totalDeductions;
        return this.netSales;
      },
      computeCredits() {
        this.credits = store.state.creditTotal;
        return this.credits;
      },
      computeTakeHome() {
        this.takeHome = this.netCash + this.credits;
        return this.takeHome;
      },
    }
  })
  export default class DailyAccountingForm extends Vue {
    public totalSalesInput = NaN;
    public onlineSalesInput = NaN;
    public cashInRegisterInput = NaN;
    public remarksInput = "";

    public physicalSales = 0;
    public totalDeductions = 0;
    public expensesDeductions = 0;
    public stocksDeductions = 0;

    public netSales = 0;
    public netCash = 0;

    public credits = 0;
    public takeHome = 0;

    public isLoading = true;
    public dailyAccountings = [];
    public isAccomplished = false;

    public changeDateEventListener?: any;

    mounted() {
      this.setUp();
      this.changeDateEventListener = subscribe('changeDate', this.setUp);
    }

    beforeUnmount() {
      this.changeDateEventListener.unsubscribe();
    }

    private async setUp() {
      this.isLoading = true;
      await this.setTodaysDailyAccounting()
      this.isLoading = false;
    }

    private async getTodaysDailyAccounting() {
      console.log('getTodaysDailyAccounting');
      const unixStart = store.state.dateUnix;
      const unixOneDayInMS = 86400 * 1000;
      const unixEnd = unixStart + unixOneDayInMS - 1; 

      const url = `${backendString}/api/dailyAccountings/${unixStart}/${unixEnd}`;

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return await result.json();
    }

    private async setTodaysDailyAccounting() {
      this.getTodaysDailyAccounting().then(accountings => {
        console.log(accountings);
        if (accountings.length > 0) {
          this.dailyAccountings = accountings;
          this.isAccomplished = true;
        } else {
          this.isAccomplished = false;
        }
        this.isLoading = false;
      })
    }

    private async sendNewDailyAccounting() {
      const newDailyAccounting = {
        date: store.state.dateUnix,
        totalSales: this.totalSalesInput,
        onlineSales: this.onlineSalesInput,
        physicalSales: this.physicalSales,
        totalDeductions: this.totalDeductions,
        expensesDeductions: this.expensesDeductions,
        stocksDeductions: this.stocksDeductions,
        netSales: this.netSales,
        netCash: this.netCash,
        credits: this.credits,
        takeHome: this.takeHome,
        cashInRegister: this.cashInRegisterInput,
        remarks: this.remarksInput
      }
      
      const result = await fetch(`${backendString}/api/dailyAccountings`, {
        method: 'POST',
        headers: {
          'Authorization': getBearerToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newDailyAccounting })
      })

      return await result;
    }

    public async submit(e: Event) {
      e.preventDefault();

      if (
        isNaN(this.totalSalesInput) || 
        isNaN(this.onlineSalesInput) ||
        isNaN(this.cashInRegisterInput)
      ) {
        alert('Please fill out the daily form');
        return;
      }

      this.isLoading = true;
      const result = await this.sendNewDailyAccounting();
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      await this.setTodaysDailyAccounting();
    }

    public async deleteForm(e: Event, key: string) {
      e.preventDefault()
      this.isLoading = true;
      const res = await this.deleteDailyAccounting(key);

      if (res.status !== 200) {
        alert('Error deleting');
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
      this.isAccomplished = false;
      return;
    }

    private async deleteDailyAccounting(id: string){
      const result = await fetch(`${backendString}/api/dailyAccountings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getBearerToken()
        }
      })

      return await result;
    }
  }
</script>