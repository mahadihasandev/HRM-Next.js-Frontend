import test from 'node:test';
import assert from 'node:assert/strict';
import { AUTH_STORAGE_KEY, clearAuthSession, persistAuthSession, readAuthSession } from '../lib/api/authStorage';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

test('Remember me controls persistence and logout clears both stores and legacy credentials', () => {
  const stores = { localStorage: new MemoryStorage(), sessionStorage: new MemoryStorage() };
  const payload = { token: 'fake-session-token' };
  persistAuthSession(payload, true, stores);
  assert.equal(stores.localStorage.getItem(AUTH_STORAGE_KEY), JSON.stringify(payload));
  persistAuthSession(payload, false, stores);
  assert.equal(stores.localStorage.getItem(AUTH_STORAGE_KEY), null);
  assert.equal(readAuthSession(stores), JSON.stringify(payload));
  stores.localStorage.setItem('auth_token', 'legacy');
  stores.sessionStorage.setItem('hrm_api_key', 'legacy');
  clearAuthSession(stores);
  assert.equal(stores.localStorage.length + stores.sessionStorage.length, 0);
});
