/**
 * Módulo de exportação para erros do domínio
 *
 * Este arquivo centraliza todos os tipos de erros personalizados da aplicação,
 * facilitando seu uso em diferentes camadas do sistema.
 *
 * @module domain/errors
 */

/** Erro base da aplicação com suporte a códigos HTTP */
export * from "./application-error";
/** Erro para parâmetros obrigatórios não informados (HTTP 400) */
export * from "./missing-param-error";
/** Erro para parâmetros com valores inválidos (HTTP 400) */
export * from "./invalid-param-error";
/** Erro para recursos duplicados (HTTP 409) */
export * from "./duplicate-resource-error";
