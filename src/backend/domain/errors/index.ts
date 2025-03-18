/**
 * Módulo de exportação para erros do domínio
 *
 * Este arquivo centraliza todos os tipos de erros personalizados da aplicação,
 * facilitando seu uso em diferentes camadas do sistema através do padrão de barril
 * (barrel pattern). Isso permite importar qualquer erro do domínio a partir de um
 * único ponto de entrada.
 *
 * @module domain/errors
 *
 * @example
 *
 * // Importação simplificada de múltiplos erros
 * import {
 *   ApplicationError,
 *   MissingParamError,
 *   InvalidParamError
 * } from "@/backend/domain/errors";
 *
 * // Uso em validações
 * function validate(data: any) {
 *   if (!data.email) {
 *     throw new MissingParamError("email");
 *   }
 *
 *   if (!isValidEmail(data.email)) {
 *     throw new InvalidParamError("email", "formato inválido");
 *   }
 * }
 *
 */

/** Erro base da aplicação com suporte a códigos HTTP */
export * from "./application-error";
/** Erro para parâmetros obrigatórios não informados (HTTP 400) */
export * from "./missing-param-error";
/** Erro para parâmetros com valores inválidos (HTTP 400) */
export * from "./invalid-param-error";
/** Erro para recursos duplicados (HTTP 409) */
export * from "./duplicate-resource-error";
/** Erro para falhas internas do servidor (HTTP 500) */
export * from "./server-error";
