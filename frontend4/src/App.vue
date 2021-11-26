<template>
  <div id="nav">
    <router-link to="/" v-show="isLoggedIn">Add</router-link> |
    <router-link to="/businessDetails" v-show="isLoggedIn">Business Details</router-link> |
    <router-link to="/login" v-show="!isLoggedIn">Login</router-link> |
    <LogoutButton v-show="isLoggedIn"/> 
  </div>
  <router-view/>
</template>

<script lang="ts">
  import { Vue, Options } from 'vue-class-component';
  import LogoutButton from './components/LogoutButton.vue';
  import store from './store/index';
  import { isAuthenticated } from './utils/authorization.util';

  @Options({
    components: {
      LogoutButton
    },
    computed: {
      isLoggedIn() {
        return store.state.isLoggedIn 
      }
    }
  })
  export default class App extends Vue {
    mounted() {
      store.commit('setLogIn', isAuthenticated());
    }
  }
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
