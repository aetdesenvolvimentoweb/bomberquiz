/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpRequest<T = any> = {
  body: T;
  dynamicParams?: any;
};

export type HttpResponse<T = any> = {
  body: {
    data?: T;
    error?: string;
  };
  headers?: {
    [key: string]: string;
  };
  statusCode: number;
};
