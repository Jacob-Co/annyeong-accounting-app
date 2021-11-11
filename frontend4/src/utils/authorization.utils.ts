export function isAuthenticated(): boolean {
  return !!window.localStorage.getItem('annyeongToken');
}