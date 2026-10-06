export interface ApiResponse<T = unknown> {
  status: boolean | string;
  message?: string;
  data: T;
  total?: number;
  month?: string;
}
