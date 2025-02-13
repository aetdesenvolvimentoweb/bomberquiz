import { HttpRequest, HttpResponse } from "./http";

/**
 * Define o contrato base para os controllers da aplicação
 */
export interface Controller {
  /**
   * Processa uma requisição HTTP
   * @param httpRequest Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
