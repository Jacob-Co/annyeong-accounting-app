<template>
  <div>
    
    <div class="spinner-border text-primary" role="status" v-show="isLoading">
      <span class="visually-hidden">Loading...</span>
    </div>
    
    <form class="d-flex-column align-items-start" v-show="!isLoading">

      <div class="d-flex flex-wrap" v-show="isLoading">

        <!-- <input
          type="date"
          v-model="dateInput"
          disabled
        /> -->

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
          style="marginRight: 1rem"
        >
          Add Only
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

    <h4>Total: {{ totalStocks }}</h4>
    <h4 class="text-danger">Deducted from daily: {{ totalDeductedStock }}</h4>
    <ul class="list-group">
      <li
        v-for="stock in stocks"
        :key="stock._id"
        class="list-group-item"
        aria-label="test"
      >
        <details>
          <summary>
            {{stock.distributor}}: {{stock.price}}
            <span 
              class="text-danger" 
              v-if="stock.isDeductingFromDaily"
            >
              Deducted from daily
            </span>
            <button
              class="btn text-white bg-danger d-inline"
              @click="deleteStockButton($event, stock._id)"
            >
            X
            </button>
          </summary>
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
  import store from '../store/index';
  import { subscribe } from '../utils/pubSub.util';

  @Options({})
  export default class StockForm extends Vue {
    public distributors = [];
    // public dateInput = getDateTodayInYMD();
    public priceInput = NaN;
    public distributorInput = '';
    public remarksInput = '';
    public isLoading = false;
    public stocks = [];
    public totalStocks = 0;
    public totalDeductedStock = 0;
    public changeDateEventListener?: any;

    mounted() {
      this.getDistributors().then(res => this.distributors = res);
      this.setUp();

      this.changeDateEventListener = subscribe('changeDate', this.setUp)
    }

    beforeUnmount() {
      this.changeDateEventListener.unsubscribe();
    }

    private async setUp() {
      this.isLoading = true;
      await this.setTodaysStocks();
      this.isLoading = false;
    }

    public async deductFromDaily(e: Event) {
      e.preventDefault();
      this.isLoading = true;
      const result = await this.sendNewStock(true);
      if (result.status !== 200) {
        alert('Error');
        this.isLoading = false;
        return;
      }
      this.setTodaysStocks();
      this.isLoading = false;
      this.resetInputs(); 
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

    private async setTodaysStocks() {
      this.getTodaysStocks().then(res => {
        this.stocks = res;
        this.totalStocks = 0;
        this.totalDeductedStock = 0;
        // @ts-ignore
        res.forEach(stock => {
          this.totalStocks += stock['price'];
          if (stock['isDeductingFromDaily']) {
            this.totalDeductedStock += stock['price'];
          }
        });
        store.commit('setStockTotal', this.totalDeductedStock)
      });
    }

    private async getTodaysStocks() {
      const unixStart = new Date(store.state.dateUnix).getTime();
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
    private async sendNewStock(isDeducting: boolean = false) {
      if (Number.isNaN(this.priceInput) || this.distributorInput === '') {
        alert('Missing distributor or price');
        return { status: 400 };
      }

      const body = {
        // date: new Date(this.dateInput).getTime(),
        date: store.state.dateUnix,
        distributor: this.distributorInput,
        price: this.priceInput * -1,
        remarks: this.remarksInput,
        isDeductingFromDaily: isDeducting
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
      this.setTodaysStocks();
      this.isLoading = false;
      this.resetInputs(); 
    }

    public async deleteStockButton(e: Event, key: string) {
      e.preventDefault();
      this.isLoading = true;

      const result = await this.deleteStock(key);

      if (result.status !== 200) {
        alert('Error in deleting stock');
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
      await this.setTodaysStocks();
      return;
    }

    private async deleteStock(id: string) {
      const result = await fetch(`${backendString}/api/stocks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': getBearerToken()
        }
      });

      return result;
    }
  }
</script>

<style scoped>
</style>