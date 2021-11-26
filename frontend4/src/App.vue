<template>
  <div id="nav">
    <router-link to="/" v-show="isAuthenticated">Add</router-link> |
    <router-link to="/businessDetails" v-show="isAuthenticated">Business Details</router-link> |
    <router-link to="/login" v-show="!isAuthenticated">Login</router-link> |
    <LogoutButton v-show="isAuthenticated"/> 
  </div>
  <router-view/>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import LogoutButton from './components/LogoutButton.vue';
  import { isAuthenticated } from './utils/authorization.util';

  @Options({
    components: {
      LogoutButton
    },
    computed: {
      isAuthenticated() {
        return isAuthenticated();
      }
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
