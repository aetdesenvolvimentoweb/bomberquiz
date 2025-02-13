/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Define o contrato para requisições HTTP
 */
export interface HttpRequest<T = any> {
  body: T;
  dynamicParams?: any;
}

/**
 * Define o contrato para respostas HTTP
 */
export interface HttpResponse<T = any> {
  body: {
    data?: T;
    error?: string;
  };
  headers?: {
    [key: string]: string;
  };
  statusCode: number;
}
