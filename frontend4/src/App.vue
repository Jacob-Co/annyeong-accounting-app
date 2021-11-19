<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/dailyAccounting">Daily Accounting</router-link> |
    <router-link to="/businessDetails">Business Details</router-link> |
    <router-link to="/login">Login</router-link> |
    <LogoutButton/> 
  </div>
  <router-view/>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import LogoutButton from './components/LogoutButton.vue';

  @Options({
    components: {
      LogoutButton
    }
  })
  export default class App extends Vue {} 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
