import { backendString } from '@/utils/server.util';
import router from '../router/index';
import store from '../store/index';

type loginCredentials = {
  username: string
  password: string
} 

export class Login {
  public static async impl(credentails: loginCredentials) {
    const result = await fetch(`${backendString}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentails)
    })
    if (result.status === 200) {
      const token = await result.json();
      window.localStorage.setItem('annyeongToken', token);
      store.commit('setLogIn', true);
      router.push('/');
    } else {
      alert('Error logging in');
    } 
  }
}