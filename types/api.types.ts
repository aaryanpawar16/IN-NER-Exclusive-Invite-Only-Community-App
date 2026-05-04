// ─────────────────────────────────────────────────────────────────
// Generic API envelope
// ─────────────────────────────────────────────────────────────────

export type ApiResponse<T> = {
  data:    T;
  message: string;
  success: boolean;
};

export type ApiError = {
  message:    string;
  statusCode: number;
  errors?:    Record<string, string[]>;
};

// ─────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────

export type PaginatedResponse<T> = ApiResponse<{
  items:      T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}>;

export type PaginationMeta = {
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
  hasMore:    boolean;
};

export type PaginationParams = {
  page?:     number;
  pageSize?: number;
};

// ─────────────────────────────────────────────────────────────────
// Request options
// ─────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?:  HttpMethod;
  body?:    unknown;
  headers?: Record<string, string>;
  timeout?: number;
};

// ─────────────────────────────────────────────────────────────────
// Sort / filter primitives
// ─────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

export type SortParam<T extends string = string> = {
  field:     T;
  direction: SortDirection;
};

export type FilterParam<T extends string = string> = {
  field: T;
  value: string | number | boolean;
};