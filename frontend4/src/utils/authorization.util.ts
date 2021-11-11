export function isAuthenticated(): boolean {
  return !!window.localStorage.getItem('annyeongToken');
}

export function getBearerToken(): string {
  return `Bearer ${window.localStorage.getItem('annyeongToken')}`;
}