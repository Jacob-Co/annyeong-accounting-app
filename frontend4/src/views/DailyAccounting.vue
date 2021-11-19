<template>
  <DailyAccountingForm />
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import DailyAccountingForm 
    from '../components/DailyAccountingForm.vue';
  
  @Options({
    components: {
      DailyAccountingForm
    }
  })
  export default class DailyAccounting extends Vue {}
</script>