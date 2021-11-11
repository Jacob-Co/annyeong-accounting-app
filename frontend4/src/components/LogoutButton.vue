<template>
  <button class="btn btn-secondary" @click="logout">Logout</button>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import router from '../router/index';

  @Options({})
  export default class LogoutButton extends Vue {
    public logout() {
      window.localStorage.removeItem('annyeongToken');
      router.push('Login');
    }
  }
</script>