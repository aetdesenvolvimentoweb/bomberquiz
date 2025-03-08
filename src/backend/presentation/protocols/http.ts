/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpRequest<T = any> {
  body?: T;
  headers?: unknown;
  params?: unknown;
  query?: unknown;
}

export interface HttpResponse<T = any> {
  body: {
    success: boolean;
    data?: T;
    errorMessage?: string;
    metadata: {
      timestamp: string;
      requestId?: string;
    };
  };
  statusCode: number;
}
