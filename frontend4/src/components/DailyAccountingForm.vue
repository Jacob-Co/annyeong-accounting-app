<template>
  <div>
    <div class="spinner-border text-primary" role="status" v-show="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>

    <form v-show="!isLoading">
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
    public dateInput = '1998-02-10';
    public totalSalesInput = NaN;
    public onlineSalesInput = NaN;
    public cashInRegisterInput = NaN;
    public remarksInput = "";
    private _expenseTotal = 0;
    private _creditTotal = 0;
    public isLoading = false;
    public isAccomplished = false;

    mounted() {
      this.dateInput = this.getDateTodayInYMD();
    }

    private getDateTodayInYMD() {
      const today = new Date();
      const date = this.addPreZero(today.getDate().toString());
      const month = this.addPreZero((today.getMonth() + 1).toString());
      const year = today.getFullYear();
      return `${year}-${month}-${date}`
    }

    private addPreZero(str: string) {
      if (str.length === 1) {
        return `0${str}`
      }
      return str;
    }

    private async sendNewDailyAccounting() {
      const newDailyAccounting = {
        date: this.dateInput,
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
      alert('sucess');
      console.log(result)
      this.isLoading = false;
    }

  }
</script>