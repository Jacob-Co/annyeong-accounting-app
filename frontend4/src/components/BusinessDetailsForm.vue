<template>
  <form>
    <h3>{{name}}</h3>

    <div>
      <label for="capitalInput">Current Capital</label>
      <input 
        type="string"
        v-model="capitalInput"
        id="capitalInput"
        disabled
      />
    </div>

    <div>
      <label for="capitalInput">Current Income</label>
      <input 
        type="string"
        v-model="incomeInput"
        id="incomeInput"
        disabled
      />
    </div>

    <div>
      <label for="capitalPercentInput">Capital Percent</label>
      <input 
        type="string"
        v-model="capitalPercentInput"
        id="capitalPercentInput"
        disabled
      />
    </div>

    <div>
      <label for="incomePercentInput">Income Percent</label>
      <input 
        type="string"
        v-model="incomePercentInput"
        id="incomePercentInput"
        disabled
      />
    </div>

    <div>
      <label for="balanceInput">Credit Balance</label>
      <input 
        type="string"
        v-model="balanceInput"
        id="balanceInput"
        disabled
      />
    </div>
  </form>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import { getBusinessDetails } 
    from '../functions/business-details-form.function';

  @Options({
    components: {
      getBusinessDetails
    }
  })
  export default class BusinessDetails extends Vue {
    public capitalInput = 'Loading';
    public capitalPercentInput = 'Loading';
    public incomePercentInput = 'Loading';
    public incomeInput = 'Loading';
    public name = "Loading";
    public balanceInput = "Loading";

    beforeCreate() {
      getBusinessDetails().then(businessDetails => {
        this.name = businessDetails.name;
        this.capitalInput = businessDetails.capital.toString();
        this.incomeInput = businessDetails.income.toString();
        this.capitalPercentInput = businessDetails.capitalPercent.toString();
        this.incomePercentInput = businessDetails.incomePercent.toString();
        this.balanceInput = businessDetails.balance.toString();
      })
    }
  }
</script>