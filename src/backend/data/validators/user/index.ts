/**
 * Módulo de exportação para validadores de usuário na camada de dados
 *
 * Este arquivo centraliza a exportação dos validadores de usuário implementados
 * na camada de dados (data layer). Diferentemente dos validadores na camada de
 * infraestrutura que utilizam bibliotecas externas, os validadores nesta camada
 * implementam regras de negócio que dependem do acesso a repositórios.
 *
 * Validadores incluídos:
 * - UserUniqueEmailValidator: Verifica se um e-mail já está em uso no sistema,
 *   consultando o repositório de usuários
 *
 * @module data/validators/user
 *
 * @example
 *
 * // Importação do validador
 * import { UserUniqueEmailValidator } from "@/backend/data/validators/user";
 *
 * // Uso em uma factory
 * const createValidators = (userRepository) => {
 *   return {
 *     uniqueEmailValidator: new UserUniqueEmailValidator(userRepository)
 *   };
 * };
 *
 */

export * from "./user-unique-email-validator";
