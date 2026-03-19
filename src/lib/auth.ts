const AUTH_STORAGE_KEY = 'medsecure-authenticated';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setAuthenticated(isLoggedIn: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isLoggedIn) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
