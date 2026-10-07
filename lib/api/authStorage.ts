export const AUTH_STORAGE_KEY = 'my-app-auth';
type SessionStores = { localStorage: Storage; sessionStorage: Storage };
const browserStores = (): SessionStores | null => typeof window === 'undefined' ? null : window;

export function readAuthSession(stores = browserStores()): string | null {
  if (!stores) return null;
  return stores.localStorage.getItem(AUTH_STORAGE_KEY) || stores.sessionStorage.getItem(AUTH_STORAGE_KEY);
}

export function persistAuthSession(payload: unknown, rememberMe: boolean, stores = browserStores()): void {
  if (!stores) return;
  const target = rememberMe ? stores.localStorage : stores.sessionStorage;
  const other = rememberMe ? stores.sessionStorage : stores.localStorage;
  other.removeItem(AUTH_STORAGE_KEY);
  target.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
}

export function clearAuthSession(stores = browserStores()): void {
  if (!stores) return;
  for (const storage of [stores.localStorage, stores.sessionStorage]) {
    storage.removeItem(AUTH_STORAGE_KEY);
    storage.removeItem('auth_token');
    storage.removeItem('hrm_api_key');
  }
}
