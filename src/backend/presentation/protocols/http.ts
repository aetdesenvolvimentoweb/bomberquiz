/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpRequest<T = any> = {
  body: T;
};

export type HttpResponse<T = any> = {
  body: {
    data?: T;
    error?: string;
  };
  statusCode: number;
};
