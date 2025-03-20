/**
 * Definição da interface para controladores na camada de apresentação
 *
 * Este módulo define a interface básica que todos os controladores devem
 * implementar. Controladores são responsáveis por receber requisições HTTP,
 * delegá-las aos casos de uso apropriados e formatar as respostas adequadamente.
 *
 * A interface Controller abstrai os detalhes específicos do framework HTTP
 * utilizado, permitindo que a lógica de controle seja testada independentemente
 * da infraestrutura de entrega.
 *
 * @module presentation/protocols/controller
 *
 * @example
 *
 * // Implementação de um controlador de criação de usuário
 * class CreateUserController implements Controller {
 *   constructor(private readonly createUserUseCase: UserCreateUseCase) {}
 *
 *   async handle(request: HttpRequest): Promise<HttpResponse> {
 *     try {
 *       // Delega para o caso de uso
 *       await this.createUserUseCase.create(request.body);
 *
 *       // Formata a resposta de sucesso
 *       return {
 *         statusCode: 201,
 *         body: {
 *           success: true,
 *           metadata: {
 *             timestamp: new Date().toISOString(),
 *             requestId: request.headers?.requestId
 *           }
 *         }
 *       };
 *     } catch (error) {
 *       // Tratamento de erros
 *       if (error instanceof ApplicationError) {
 *         return {
 *           statusCode: error.statusCode,
 *           body: {
 *             success: false,
 *             errorMessage: error.message,
 *             metadata: {
 *               timestamp: new Date().toISOString(),
 *               requestId: request.headers?.requestId
 *             }
 *           }
 *         };
 *       }
 *
 *       // Erro não tratado
 *       return {
 *         statusCode: 500,
 *         body: {
 *           success: false,
 *           errorMessage: 'Erro interno do servidor',
 *           metadata: {
 *             timestamp: new Date().toISOString(),
 *             requestId: request.headers?.requestId
 *           }
 *         }
 *       };
 *     }
 *   }
 * }
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRequest, HttpResponse } from "./http";

/**
 * Interface para controladores na camada de apresentação
 *
 * Define o contrato que todos os controladores devem seguir,
 * independentemente do caso de uso específico que implementam.
 *
 * @template T Tipo dos dados processados pelo controlador
 *
 * @interface Controller
 */
export interface Controller<T = any> {
  /**
   * Processa uma requisição HTTP e retorna uma resposta adequada
   *
   * Este método é responsável por:
   * - Extrair e validar os dados da requisição
   * - Delegar o processamento para o caso de uso apropriado
   * - Transformar o resultado do caso de uso em uma resposta HTTP
   * - Tratar quaisquer erros que ocorram durante o processamento
   *
   * @param {HttpRequest<T>} request - Objeto de requisição com os dados a serem processados
   * @returns {Promise<HttpResponse<T>>} Promise que resolve com a resposta HTTP formatada
   *
   * @throws {Error} Normalmente não deve lançar exceções, mas tratá-las e transformá-las em respostas HTTP
   */
  handle: (request: HttpRequest<T>) => Promise<HttpResponse<T>>;
}
