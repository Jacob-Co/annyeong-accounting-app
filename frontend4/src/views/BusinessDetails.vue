<template>
  <BusinessDetailsForm/>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import BusinessDetailsForm from '../components/BusinessDetailsForm.vue';

  @Options({
    components: {
      BusinessDetailsForm
    }
  })
  export default class BusinessDetails extends Vue {}
</script>