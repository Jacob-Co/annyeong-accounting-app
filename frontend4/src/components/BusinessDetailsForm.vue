<template>
  <form>
    <div>
      <label for="capitalInput">Capital</label>
      <input type="number" placeholder="100,000" disabled/>
    </div>

    <div>
      <label for="capitalPercentInput">Capital Percent</label>
      <input type="number" disabled/>
    </div>

    <div>
      <label for="incomePercentInput">Income Percent</label>
      <input type="number" disabled/>
    </div>
  </form>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';

  @Options({})
  export default class BusinessDetails extends Vue {

  }
</script>