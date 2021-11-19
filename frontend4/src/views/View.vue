<template>
  <p>Hello View</p>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';

  @Options({})
  export default class View extends Vue {}
</script>