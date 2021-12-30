<template>
  <div>
    <h1>Repayment</h1>
  </div>
</template>

<script lang="ts">
  import {Vue, Options} from 'vue-class-component'
  import { getBearerToken } from '../utils/authorization.util'
  import { backendString } from '../utils/server.util'

  @Options({})
  export default class RepaymentTab extends Vue {
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