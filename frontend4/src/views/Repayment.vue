<template>
  <div>
    <RepaymentTab />
  </div>
</template>

<script lang="ts">
  import {Vue, Options} from 'vue-class-component'
  import RepaymentTab from '../components/RepaymentTab.vue';

  @Options({
    components: {
      RepaymentTab
    }
  })
  export default class Repayment extends Vue {

  }
</script>

<style scoped>
</style>