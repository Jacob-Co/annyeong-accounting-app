<template>
  <form class="d-flex-column align-items-start">
    <div class="d-flex flex-wrap">
      <input type="date"/>
      <select class="form-select" aria-label="Default select example">
        <option selected disabled>Expnese Type</option>
      </select>
      <input type="number" placeholder="price"/>
      <input type="string" placeholder="remarks"/>
    </div>
    <div class="d-flex">
      <button type="submit" class="btn-primary btn align-self-start">
        Add
      </button>
    </div>
  </form>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import { backendString } from '../utils/server.util';
  import { getBearerToken } from '../utils/authorization.util';

  @Options({})
  export default class ExpenseForm extends Vue {
    mounted() {
     this.getExpenseTypes().then(res => console.log(res)) 
    }

    public async getExpenseTypes() {
      const result = await fetch(`${backendString}/api/expenseTypes/all`, {
        method: 'GET',
        headers: {
          'Authorization': getBearerToken() 
        },
      })
      return await result.json();
    }

  }
</script>

<style>
  input {
    min-width: 2rem
  }

  select {
    max-width: 15rem;
  }
</style>