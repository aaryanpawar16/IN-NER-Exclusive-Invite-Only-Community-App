import {
  API_BASE_URL,
  API_TIMEOUT_MS,
  SESSION_KEY,
} from '@/constants/config';

// ─────────────────────────────────────────────────────────────────
// Types
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

export type PaginatedResponse<T> = ApiResponse<{
  items:      T[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
}>;

export type RequestOptions = {
  method?:  'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?:    unknown;
  headers?: Record<string, string>;
  timeout?: number;
};

// ─────────────────────────────────────────────────────────────────
// Token storage (AsyncStorage wrapper)
// ─────────────────────────────────────────────────────────────────

let _token: string | null = null;

export const tokenStore = {
  get: ()              => _token,
  set: (t: string)     => { _token = t; },
  clear: ()            => { _token = null; },
};

// ─────────────────────────────────────────────────────────────────
// Core request
// ─────────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options:  RequestOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method  = 'GET',
    body,
    headers = {},
    timeout = API_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), timeout);

  const token = tokenStore.get();

  const config: RequestInit = {
    method,
    signal:  controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    clearTimeout(timer);

    // Parse response body
    const text = await response.text();
    const json = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const apiError: ApiError = {
        message:    json.message ?? `Request failed (${response.status})`,
        statusCode: response.status,
        errors:     json.errors,
      };

      // Handle 401 — clear token and redirect
      if (response.status === 401) {
        tokenStore.clear();
        throw new ApiClientError(apiError);
      }

      throw new ApiClientError(apiError);
    }

    return json as ApiResponse<T>;
  } catch (err) {
    clearTimeout(timer);

    if (err instanceof ApiClientError) throw err;

    // Timeout
    if ((err as any)?.name === 'AbortError') {
      throw new ApiClientError({
        message:    'Request timed out. Check your connection and try again.',
        statusCode: 408,
      });
    }

    // Network error
    throw new ApiClientError({
      message:    'Network error. Check your connection and try again.',
      statusCode: 0,
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// Custom error class
// ─────────────────────────────────────────────────────────────────

export class ApiClientError extends Error {
  statusCode: number;
  errors?:    Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name       = 'ApiClientError';
    this.statusCode = apiError.statusCode;
    this.errors     = apiError.errors;
  }

  get isUnauthorized()  { return this.statusCode === 401; }
  get isNotFound()      { return this.statusCode === 404; }
  get isServerError()   { return this.statusCode >= 500;  }
  get isNetworkError()  { return this.statusCode === 0;   }
  get isTimeout()       { return this.statusCode === 408; }
}

// ─────────────────────────────────────────────────────────────────
// HTTP helpers
// ─────────────────────────────────────────────────────────────────

export const api = {
  get: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'GET' }),

  post: <T>(endpoint: string, body: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'POST', body }),

  put: <T>(endpoint: string, body: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'PUT', body }),

  patch: <T>(endpoint: string, body: unknown, opts?: Omit<RequestOptions, 'method'>) =>
    request<T>(endpoint, { ...opts, method: 'PATCH', body }),

  delete: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...opts, method: 'DELETE' }),
};

// ─────────────────────────────────────────────────────────────────
// Query string builder
// ─────────────────────────────────────────────────────────────────

export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  );
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}