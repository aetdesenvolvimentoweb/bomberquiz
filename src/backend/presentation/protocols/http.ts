/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Definições de tipos para requisições e respostas HTTP na camada de apresentação
 *
 * Este módulo define as interfaces para padronizar a comunicação entre
 * controladores e middlewares na camada de apresentação, abstraindo os
 * detalhes específicos do framework HTTP utilizado (como Express, Fastify, etc).
 *
 * @module presentation/protocols/http
 *
 * @example
 *
 * // Uso em um controlador
 * class UserController {
 *   constructor(private readonly createUserUseCase: UserCreateUseCase) {}
 *
 *   async create(httpRequest: HttpRequest): Promise<HttpResponse> {
 *     try {
 *       await this.createUserUseCase.create(httpRequest.body);
 *
 *       return {
 *         statusCode: 201,
 *         body: {
 *           success: true,
 *           metadata: {
 *             timestamp: new Date().toISOString(),
 *             requestId: httpRequest.headers?.requestId
 *           }
 *         }
 *       };
 *     } catch (error) {
 *       // Tratamento de erro
 *     }
 *   }
 * }
 */

/**
 * Interface que define a estrutura de uma requisição HTTP
 *
 * Encapsula os dados da requisição independente do framework HTTP
 * utilizado, facilitando testes e manutenção.
 *
 * @template T Tipo dos dados no corpo da requisição
 *
 * @interface HttpRequest
 */
export interface HttpRequest<T = any> {
  /** Corpo da requisição, contendo os dados enviados pelo cliente */
  body?: T;

  /** Cabeçalhos da requisição HTTP */
  headers?: unknown;

  /** Parâmetros de rota (ex: /users/:id, onde :id é um parâmetro) */
  params?: unknown;

  /** Parâmetros de consulta (query string: ?key=value) */
  query?: unknown;
}

/**
 * Interface que define a estrutura de uma resposta HTTP
 *
 * Padroniza o formato de resposta da API, garantindo consistência
 * em todas as rotas e endpoints.
 *
 * @template T Tipo dos dados retornados no campo data
 *
 * @interface HttpResponse
 */
export interface HttpResponse<T = any> {
  /** Corpo da resposta HTTP com formato padronizado */
  body: {
    /** Indica se a operação foi bem-sucedida */
    success: boolean;

    /** Dados retornados pela operação (quando bem-sucedida) */
    data?: T;

    /** Mensagem de erro (quando a operação falha) */
    errorMessage?: string;

    /** Metadados da resposta */
    metadata: {
      /** Timestamp ISO da resposta */
      timestamp: string;

      /** Identificador único da requisição para rastreabilidade */
      requestId?: string;
    };
  };

  /** Código de status HTTP da resposta (ex: 200, 400, 404, 500) */
  statusCode: number;
}
