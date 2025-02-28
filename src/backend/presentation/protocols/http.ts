/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest<T = any> {
  body?: T;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  query?: Record<string, string>;
}

export interface HttpResponse<T = any> {
  statusCode: number;
  body: {
    success: boolean;
    data?: T;
    error?: {
      code: string;
      message: string;
      details?: unknown;
    };
    metadata: {
      timestamp: string;
      requestId?: string;
    };
  };
}
