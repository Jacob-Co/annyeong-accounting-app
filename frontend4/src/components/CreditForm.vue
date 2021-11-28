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
          class="form-select d-block" 
          aria-label="Default select example"
          v-model="creditorInput"
        >
          <option selected disabled value="">Creditor Name</option>
          <option 
            v-for="creditor in creditors" 
            :key="creditor._id"
            :value="creditor._id.toString()"
          >
            {{creditor.wholeName}}
          </option>
        </select>

        <div class="input-group">
          <span class="input-group-text">Price</span>
          <span 
            class="input-group-text bg-danger" 
            v-show="isDebt"
            @click="toggleDebt"
          >
            -
          </span>
          <span 
            class="input-group-text bg-success"
            v-show="!isDebt"
            @click="toggleDebt"
          >
            +
          </span>
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
    
    <h4>Total: {{ totalCredits }}</h4>
    <ul class="list-group">
      <li
        v-for="credit in credits"
        :key="credit._id"
        class="list-group-item"
        aria-label="test"
      >
        <details>
          <summary>{{credit.creditor}}: {{credit.amount}}</summary>
          {{credit.remarks || 'No remarks'}}
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

  @Options({})
  export default class CreditorForm extends Vue {
    public creditors = [];
    public credits = [];
    public totalCredits = 0;
    public dateInput = getDateTodayInYMD();
    public priceInput = NaN;
    public creditorInput = '';
    public remarksInput = '';
    public isLoading = false;
    public isDebt = true;

    mounted() {
     this.getCreditors().then(res => this.creditors = res);
    //  this.getTodaysCredits().then(res => console.log(res));
    this.setTodaysCredits();
    }

    public toggleDebt() {
      this.isDebt = !this.isDebt;
    }

    private async setTodaysCredits() {
      this.getTodaysCredits().then(res => {
        this.credits = res;
        this.totalCredits = this.credits.reduce((val, curVal) => {
          return val + curVal['amount']
        }, 0);
        store.commit('setCreditTotal', this.totalCredits);
      });
    }

    private async getTodaysCredits() {
      const unixStart = new Date(this.dateInput).getTime();
      const unixOneDayInMS = 86400 * 1000;
      const unixEnd = unixStart + unixOneDayInMS - 1; 

      const url = `${backendString}/api/credits/${unixStart}/${unixEnd}/0`;

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return await result.json();
    }

    private async getCreditors() {
      const result = await fetch(`${backendString}/api/creditors/all`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken() 
        },
      })
      return await result.json();
    }

    private getAmount() {
      return this.isDebt
        ? this.priceInput * -1
        : this.priceInput
    }

    private async sendNewCredit() {
      const body = {
        date: new Date(this.dateInput).getTime(),
        creditor: this.creditorInput,
        amount: this.getAmount(),
        remarks: this.remarksInput,
        isPaid: false
      };
      const result = await fetch(`${backendString}/api/credits/`, {
        method: 'POST',
        headers: {
          'Authorization': getBearerToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credit: body}) 
      });
      return await result;
    }

    private resetInputs() {
      this.priceInput = NaN;
      this.creditorInput = '';
      this.remarksInput = '';
    }

    public async submit(e: Event) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendNewCredit();
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.setTodaysCredits();
      this.resetInputs(); 
    }

  }
</script>

<style scoped>
</style>