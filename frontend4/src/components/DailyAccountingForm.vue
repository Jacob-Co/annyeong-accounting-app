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
              <li class="list-group-item">Expenses: {{dailyAccounting.expenses}}</li>
              <li class="list-group-item">Net Sales: {{dailyAccounting.netSales}}</li>
              <li class="list-group-item">Credits: {{dailyAccounting.credits}}</li>
              <li class="list-group-item">Take Home: {{dailyAccounting.takeHomeCash}}</li>
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
      <div>
        <input
          type="date"
          v-model="dateInput"
          disabled
        />
      </div>

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
          v-model="physicalSalesInput"
          disabled
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Expenses</span>
        <input
          class="form-control"
          type="number"
          disabled
          v-model="expenseTotal"
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text bg-info">Net Sales</span>
        <input
          class="form-control"
          type="number"
          v-model="netSales"
          disabled
          placeholder="0"
        />
        <span class="input-group-text">php</span>
      </div>

      <div class="input-group">
        <span class="input-group-text">Credit</span>
        <input
          class="form-control"
          type="number"
          disabled
          v-model="creditTotal"
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
          v-model="takeHome"
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

  @Options({
    computed: {
      expenseTotal() {
        this._expenseTotal = store.state.expenseTotal
        return store.state.expenseTotal
      },
      creditTotal() {
        this._creditTotal = store.state.creditTotal
        return store.state.creditTotal
      },
      physicalSalesInput() {
        return this.totalSalesInput - this.onlineSalesInput;
      },
      netSales() {
        return this.totalSalesInput + this._expenseTotal 
      },
      takeHome() {
        return this.totalSalesInput + this._expenseTotal + this._creditTotal
      }
    }
  })
  export default class DailyAccountingForm extends Vue {
    public dateInput = getDateTodayInYMD();
    public totalSalesInput = NaN;
    public onlineSalesInput = NaN;
    public cashInRegisterInput = NaN;
    public remarksInput = "";
    private _expenseTotal = 0;
    private _creditTotal = 0;
    public isLoading = true;
    public isAccomplished = false;
    public dailyAccountings = [];

    mounted() {
      this.setTodaysDailyAccounting();
    }

    private async getTodaysDailyAccounting() {
      const unixStart = new Date(this.dateInput).getTime();
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
        date: new Date(this.dateInput).getTime(),
        totalSales: this.totalSalesInput,
        onlineSales: this.onlineSalesInput,
        physicalSales: this.totalSalesInput - this.onlineSalesInput,
        expenses: this._expenseTotal,
        netSales: this.totalSalesInput + this._expenseTotal,
        credits: this._creditTotal,
        takeHomeCash: this.totalSalesInput + this._expenseTotal + this._creditTotal,
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
      console.log(key);
    }
  }
</script>