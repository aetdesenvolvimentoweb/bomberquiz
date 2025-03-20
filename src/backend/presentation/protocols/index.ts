/**
 * Módulo de exportação para protocolos da camada de apresentação
 *
 * Este arquivo centraliza a exportação de todas as interfaces e tipos
 * relacionados à camada de apresentação, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer protocolo a partir
 * de um único ponto de entrada, simplificando as importações em
 * outros módulos.
 *
 * Os protocolos da camada de apresentação definem os contratos para
 * a comunicação entre o framework web (Express, Fastify, etc.) e a
 * lógica de negócio da aplicação, garantindo baixo acoplamento e
 * facilitando testes.
 *
 * @module presentation/protocols
 *
 * @example
 *
 * // Importação simplificada de múltiplos protocolos
 * import { Controller, HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
 *
 * // Implementação de um controlador
 * class UserController implements Controller {
 *   constructor(private readonly useCase: SomeUseCase) {}
 *
 *   async handle(request: HttpRequest): Promise<HttpResponse> {
 *     try {
 *       const result = await this.useCase.execute(request.body);
 *
 *       return {
 *         statusCode: 200,
 *         body: {
 *           success: true,
 *           data: result,
 *           metadata: {
 *             timestamp: new Date().toISOString()
 *           }
 *         }
 *       };
 *     } catch (error) {
 *       // Tratamento de erro
 *     }
 *   }
 * }
 */

/** Exporta a interface Controller que define o contrato para todos os controladores */
export * from "./controller";

/** Exporta as interfaces HttpRequest e HttpResponse para padronização da comunicação HTTP */
export * from "./http";
