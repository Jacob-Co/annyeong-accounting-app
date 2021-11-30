<template>
<div class="d-flex flex-column align-items-center">
<div id="main">
  <div id="nav">
    <router-link to="/" v-show="isLoggedIn"><button class="btn bg-success text-white">Add</button></router-link>
    <router-link to="/businessDetails" v-show="isLoggedIn"><button class="btn bg-info text-white">Business Details</button></router-link>
    <router-link to="/login" v-show="!isLoggedIn">Login</router-link> 
    <LogoutButton v-show="isLoggedIn"/> 
  </div>
  <router-view/>
</div>
</div>
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

#main {
  max-width: 700px;
}
</style>
