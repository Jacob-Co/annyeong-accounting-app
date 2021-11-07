<template>
  <form>
    <div>
      <label for="usernameInput">Username</label>
      <input type="text" id="usernameInput"/>
    </div>
    <div>
      <label for="passwordInput">Password</label>
      <input type="password" id="passwordInput"/>
    </div>
    <button class="btn btn-primary">Login</button>
  </form>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';

  @Options({})
  export default class LoginForm extends Vue {}
</script>