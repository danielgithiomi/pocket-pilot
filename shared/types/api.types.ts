// TOKENS
export interface RequestCookies {
  access_token: string;
  refresh_token: string;
}

// RESPONSE SUMMARY
export interface ResponseSummary {
  message: string;
  description?: string;
}

// RESPONSE STRUCTURE
export interface IGlobalResponse<T> {
  body: T;
  success: true;
  statusCode: number;
  summary: ResponseSummary;
  metadata: {
    endpoint: string;
    timestamp: string;
    requestId: string;
  };
}

export interface IStandardResponse<T> {
  data: T;
  endpoint: string;
  timestamp: string;
  statusCode: number;
  summary: ResponseSummary;
}

// EXCEPTION STRUCTURE
export interface IGlobalException {
  success: false;
  statusCode: number;
  error: {
    type: string;
    name?: string;
    title?: string;
    details?: unknown;
  };
  metadata: {
    endpoint: string;
    timestamp: string;
    requestId: string;
  };
}

export interface IStandardError {
  type: string;
  title: string;
  details?: unknown;
  statusCode: number;
}

// ENDPOINTS
export interface Endpoints {
  root: string;
  login: string;
  register: string;
}
