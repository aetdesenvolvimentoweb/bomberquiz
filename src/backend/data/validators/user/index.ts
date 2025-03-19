/**
 * Módulo de exportação para validadores de usuário na camada de dados
 *
 * Este arquivo centraliza a exportação dos validadores de usuário implementados
 * na camada de dados (data layer). Estes validadores são responsáveis por
 * orquestrar regras de negócio complexas que podem depender de múltiplos
 * validadores especializados ou acesso a repositórios.
 *
 * Validadores incluídos:
 * - UserCreateDataValidator: Orquestra a validação completa dos dados de criação
 *   de usuário, verificando campos obrigatórios e delegando validações específicas
 *   para validadores especializados
 * - UserUniqueEmailValidator: Verifica se um e-mail já está em uso no sistema,
 *   consultando o repositório de usuários
 *
 * @module data/validators/user
 *
 * @example
 *
 * // Importação dos validadores
 * import {
 *   UserCreateDataValidator,
 *   UserUniqueEmailValidator
 * } from "@/backend/data/validators/user";
 *
 * // Uso em uma factory
 * const createValidators = (
 *   userRepository,
 *   emailValidator,
 *   phoneValidator,
 *   birthdateValidator,
 *   passwordValidator
 * ) => {
 *   const uniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
 *
 *   return {
 *     userCreateValidator: new UserCreateDataValidator({
 *       userEmailValidator: emailValidator,
 *       userPhoneValidator: phoneValidator,
 *       userBirthdateValidator: birthdateValidator,
 *       userPasswordValidator: passwordValidator,
 *       userUniqueEmailValidator: uniqueEmailValidator
 *     })
 *   };
 * };
 *
 */

export * from "./user-unique-email-validator";
export * from "./user-create-data-validator";
