/**
 * Módulo de exportação para validadores na camada de dados
 *
 * Este arquivo centraliza a exportação de todos os validadores implementados
 * na camada de dados (data layer), seguindo o padrão de barril (barrel pattern).
 * Isso permite importar qualquer validador desta camada a partir de um único
 * ponto de entrada.
 *
 * Os validadores nesta camada implementam regras de negócio que dependem
 * do acesso a repositórios e outros serviços da camada de dados, diferentemente
 * dos validadores na camada de infraestrutura que utilizam bibliotecas externas.
 *
 * Este módulo exporta validadores organizados por contexto (ex: user),
 * facilitando a localização e importação dos componentes necessários.
 *
 * @module data/validators
 *
 * @example
 *
 * // Importação simplificada de validadores
 * import { UserUniqueEmailValidator } from "@/backend/data/validators";
 *
 * // Uso em uma factory ou container de injeção de dependência
 * const createValidators = (repositories) => {
 *   return {
 *     uniqueEmailValidator: new UserUniqueEmailValidator(repositories.userRepository)
 *   };
 * };
 *
 */

/** Exporta validadores relacionados a usuários */
export * from "./user";
