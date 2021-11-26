<template>
  <form>
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

    beforeCreate() {
      getBusinessDetails().then(businessDetails => {
        console.log(businessDetails)
        this.capitalInput = businessDetails.capital.toString();
        this.incomeInput = businessDetails.income.toString();
        this.capitalPercentInput = businessDetails.capitalPercent.toString();
        this.incomePercentInput = businessDetails.incomePercent.toString();
      })
    }
  }
</script>