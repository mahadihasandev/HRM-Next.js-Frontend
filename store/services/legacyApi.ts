import { baseApi } from './baseApi';
import type { FetchArgs } from '@reduxjs/toolkit/query';

// Compatibility transport for inherited views. Authentication and base URL are centralized.
export const legacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    requestRead: builder.query<unknown, FetchArgs>({ query: (request) => request }),
    requestWrite: builder.mutation<unknown, FetchArgs>({
      query: (request) => request,
      invalidatesTags: (_result, error) => error ? [] : ['Employee', 'Attendance', 'Dashboard', 'Leave', 'Payroll', 'Requests'],
    }),
  }),
});
