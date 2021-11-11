type loginCredentials = {
  username: string
  password: string
} 

export class Login {
  public static async impl(credentails: loginCredentials) {
    console.log(JSON.stringify(credentails)) 
    const result = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentails)
    })
    const token = await result.json();
    window.localStorage.setItem('annyeongToken', token);
  }
}