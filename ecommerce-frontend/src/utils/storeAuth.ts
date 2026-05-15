const CUSTOMER_KEY = 'customerToken';

/** JWT for storefront cart & checkout (customer); falls back to admin token for local dev testing */
export function getStoreAuthToken(): string | null {
  return localStorage.getItem(CUSTOMER_KEY) || localStorage.getItem('adminToken');
}

export function setCustomerToken(token: string) {
  localStorage.setItem(CUSTOMER_KEY, token);
}

export function clearCustomerToken() {
  localStorage.removeItem(CUSTOMER_KEY);
}

export function hasCustomerSession(): boolean {
  return !!localStorage.getItem(CUSTOMER_KEY);
}

export function notifyStoreAuthChanged() {
  window.dispatchEvent(new Event('teknik-store-auth'));
}
