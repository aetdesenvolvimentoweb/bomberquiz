/**
 * Módulo de exportação para casos de uso relacionados a usuários
 *
 * Centraliza a exportação de todas as interfaces que definem
 * as operações de negócio disponíveis para a entidade Usuário.
 *
 * @module domain/usecases/user
 */

/** Exporta o caso de uso para criação de usuários */
export * from "./user-create-usecase";

/** Exporta o caso de uso para busca de usuários por e-mail */
export * from "./user-find-by-email";
