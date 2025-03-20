/**
 * Módulo de exportação para serviços na camada de dados
 *
 * Este arquivo centraliza a exportação de todos os serviços implementados
 * na camada de dados (data layer), seguindo o padrão de barril (barrel pattern).
 * Isso permite importar qualquer serviço a partir de um único ponto de entrada,
 * simplificando as importações em outros módulos.
 *
 * Os serviços nesta camada são responsáveis por orquestrar os casos de uso
 * definidos na camada de domínio, coordenando validadores, sanitizadores,
 * repositórios e outros componentes.
 *
 * @module data/services
 *
 * @example
 *
 * // Importação simplificada de serviços
 * import { UserCreateService } from "@/backend/data/services";
 *
 * // Uso em composição de dependências
 * const userService = new UserCreateService({
 *   userRepository,
 *   userCreateDataSanitizer,
 *   userCreateValidator,
 *   loggerProvider
 * });
 *
 * // Execução do serviço
 * await userService.create(userData);
 *
 */

/** Exporta todos os serviços relacionados a usuários */
export * from "./user";
