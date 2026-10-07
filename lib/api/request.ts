import { API_BASE_URL } from './config';
import { store } from '@/store/store';
import { legacyApi } from '@/store/services/legacyApi';

/** Routes inherited views through the same authenticated RTK Query transport. */
export async function requestHrm(url: string, options: RequestInit = {}): Promise<Response> {
  const base = new URL(API_BASE_URL);
  const target = new URL(url, `${API_BASE_URL}/`);
  if (target.origin !== base.origin || !target.pathname.startsWith(`${base.pathname}/`)) {
    throw new Error('The request must use the configured HRM API URL.');
  }
  const method = options.method ?? 'GET';
  const request = { url: target.pathname.slice(base.pathname.length) + target.search, method,
    body: typeof options.body === 'string' ? JSON.parse(options.body) as unknown : undefined };
  const handle = method === 'GET'
    ? store.dispatch(legacyApi.endpoints.requestRead.initiate(request, { forceRefetch: true }))
    : store.dispatch(legacyApi.endpoints.requestWrite.initiate(request));
  try {
    const result = await handle;
    if (result.error) {
      const error = result.error;
      const status = 'status' in error && typeof error.status === 'number' ? error.status : 503;
      const body = 'data' in error ? error.data : { message: 'API request failed' };
      return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(result.data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } finally {
    if ('unsubscribe' in handle) handle.unsubscribe();
    if ('reset' in handle) handle.reset();
  }
}
