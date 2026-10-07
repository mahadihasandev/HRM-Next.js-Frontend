/** Treat HTTP-200 business failures as failures before data enters the cache. */
export function isSuccessfulApiResponse(status: number, body: unknown): boolean {
  if (status < 200 || status >= 300) return false;
  if (!body || typeof body !== 'object') return true;
  if ('status' in body && (body.status === false || body.status === 'error')) return false;
  if ('success' in body && body.success === false) return false;
  return true;
}
