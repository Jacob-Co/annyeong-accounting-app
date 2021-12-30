import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/LoginForm.vue';
import BusinessDetails from '../views/BusinessDetails.vue';
import { isAuthenticated } from '@/utils/authorization.util';
import DailyAccounting from '../views/DailyAccounting.vue';
import  View from '../views/View.vue'; 
import Repayment from '../views/Repayment.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'View',
    component: View 
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/businessDetails',
    name: 'BusinessDetails',
    component: BusinessDetails
  },
  {
    path: '/DailyAccounting',
    name: 'DailyAccounting',
    component: DailyAccounting
  },
  {
    path: '/repayment',
    name: 'Repayment',
    component: Repayment
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name !== 'Login' && !isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
})

export default router
