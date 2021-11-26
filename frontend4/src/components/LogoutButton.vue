<template>
  <button class="btn btn-secondary" @click="logout">Logout</button>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import router from '../router/index';
  import store from '../store/index';

  @Options({})
  export default class LogoutButton extends Vue {
    public logout() {
      window.localStorage.removeItem('annyeongToken');
      store.commit('setLogIn', false);
      router.push('Login');
    }
  }
</script>