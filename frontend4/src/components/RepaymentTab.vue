<template>
  <div>
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

    <div class="accordion" v-show="isCreditorChosen">
      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingOne">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
            Unsettled
          </button>
        </h2>
        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
          <div class="accordion-body">
            <p>Unsettled</p>
          </div>
        </div>
      </div>

      <div class="accordion-item">
        <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
            Settled
          </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
          <div class="accordion-body">
            <p>Settled</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Options} from 'vue-class-component'
  import { getBearerToken } from '../utils/authorization.util'
  import { backendString } from '../utils/server.util'

  @Options({
    computed: {
      isCreditorChosen() {
        return this.creditorInput !== '' || false;
      } 
    }
  })
  export default class RepaymentTab extends Vue {
    public creditors = [];
    public creditorInput = '';

    mounted() {
      this.getCreditors().then(res => this.creditors = res);
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
  }
</script>

<style scoped>
</style>