import { HttpResponse } from ".";

export interface Controller<T = any> {
  handle: (data: T) => Promise<HttpResponse>;
}
