<template>
  <form>
    <div>
      <label for="usernameInput">Username</label>
      <input type="text" id="usernameInput" v-model="username"/>
    </div>
    <div>
      <label for="passwordInput">Password</label>
      <input type="password" id="passwordInput" v-model="password"/>
    </div>
    <button class="btn btn-primary" @click="loginClick">Login</button>
  </form>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import { Login } from '../functions/login-form.function';
  @Options({})
  export default class LoginForm extends Vue {
    public username = '';
    public password = '';

    public loginClick(event: Event) {
      event.preventDefault(); 
      Login.impl({ username: this.username, password: this.password});
    }
  }
</script>