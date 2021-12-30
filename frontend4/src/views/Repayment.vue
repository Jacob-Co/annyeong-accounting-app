<template>
  <div>
    <h1>Repayment</h1>
  </div>
</template>

<script lang="ts">
  import {Vue, Options} from 'vue-class-component'
  import RepaymentForm from '../components/RepaymentForm.vue';

  @Options({
    components: {
      RepaymentForm
    }
  })
  export default class Repayment extends Vue {

  }
</script>

<style scoped>
</style>