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

    mounted() {
     this.getDistributors().then(res => this.distributors = res) 
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
      this.isLoading = false;
      this.resetInputs(); 
    }

  }
</script>

<style scoped>
</style>