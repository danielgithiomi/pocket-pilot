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

// EXCEPTION STRUCTURE
export interface IGlobalException {
  success: false;
  statusCode: number;
  error: {
    type: string;
    name?: string;
    message?: string;
    details?: unknown;
  };
  metadata: {
    endpoint: string;
    timestamp: string;
    requestId: string;
  };
}

export interface IStandardError {
  statusCode: number;
  message: string;
  type: string;
  details?: unknown;
}
