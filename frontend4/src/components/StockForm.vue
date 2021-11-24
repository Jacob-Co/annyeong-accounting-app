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
          v-model="distributorInput"
        >
          <option selected disabled value="">Distributor</option>
          <option 
            v-for="distributor in distributors" 
            :key="distributor._id"
            :value="distributor._id.toString()"
          >
            {{distributor.name}}
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

    <h4>Total: {{ totalStocks }}</h4>
    <ul class="list-group">
      <li
        v-for="stock in stocks"
        :key="stock._id"
        class="list-group-item"
        aria-label="test"
      >
        <details>
          <summary>{{stock.distributor}}: {{stock.price}}</summary>
          {{stock.remarks || 'No remarks'}}
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

  @Options({})
  export default class StockForm extends Vue {
    public distributors = [];
    public dateInput = getDateTodayInYMD();
    public priceInput = NaN;
    public distributorInput = '';
    public remarksInput = '';
    public isLoading = false;
    public stocks = [];
    public totalStocks = 0;

    mounted() {
     this.getDistributors().then(res => this.distributors = res);
     this.setTodaysCredits();
    }

    private async getDistributors() {
      const result = await fetch(`${backendString}/api/distributors/all`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken() 
        },
      })
      return await result.json();
    }

    private async setTodaysCredits() {
      this.getTodaysStocks().then(res => {
        this.stocks = res;
        this.totalStocks = this.stocks.reduce((val, curVal) => {
          return val + curVal['price']
        }, 0);
      });
    }

    private async getTodaysStocks() {
      const unixStart = new Date(this.dateInput).getTime();
      const unixOneDayInMS = 86400 * 1000;
      const unixEnd = unixStart + unixOneDayInMS - 1; 

      const url = `${backendString}/api/stocks/${unixStart}/${unixEnd}/0`;

      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return await result.json();
    }
    private async sendNewStock() {
      const body = {
        date: new Date(this.dateInput).getTime(),
        distributor: this.distributorInput,
        price: this.priceInput * -1,
        remarks: this.remarksInput
      };
      const result = await fetch(`${backendString}/api/stocks/`, {
        method: 'POST',
        headers: {
          'Authorization': getBearerToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stock: body}) 
      });
      return await result;
    }

    private resetInputs() {
      this.priceInput = NaN;
      this.distributorInput = '';
      this.remarksInput = '';
    }

    public async submit(e: Event) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendNewStock();
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.getTodaysStocks();
      this.isLoading = false;
      this.resetInputs(); 
    }

  }
</script>

<style scoped>
</style>