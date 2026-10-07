import test from 'node:test';
import assert from 'node:assert/strict';
import { isSuccessfulApiResponse } from '../lib/api/response';

test('API transport rejects HTTP and HTTP-200 business failures', () => {
  for (const status of [401, 403, 422, 500]) assert.equal(isSuccessfulApiResponse(status, { status: true }), false);
  for (const body of [{ status: false }, { status: 'error' }, { success: false }]) assert.equal(isSuccessfulApiResponse(200, body), false);
  for (const body of [{ status: true }, { status: 'success', data: [] }, []]) assert.equal(isSuccessfulApiResponse(200, body), true);
});
