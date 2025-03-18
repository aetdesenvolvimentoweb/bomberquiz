/**
 * Módulo de exportação para validadores de dados de usuário
 *
 * Este arquivo centraliza a exportação de todas as interfaces e implementações
 * relacionadas à validação de dados de usuário, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer validador de usuário a partir
 * de um único ponto de entrada.
 *
 * Os validadores de usuário são responsáveis por garantir que os dados
 * relacionados aos usuários atendam aos requisitos de negócio e restrições
 * do sistema antes de serem processados ou armazenados.
 *
 * @module domain/validators/user
 *
 * @example
 *
 * // Importação simplificada de múltiplos validadores
 * import {
 *   UserBirthdateValidatorUseCase,
 *   UserEmailValidatorUseCase,
 *   UserPasswordValidatorUseCase
 * } from "@/backend/domain/validators/user";
 *
 * // Uso em um serviço que orquestra múltiplas validações
 * class UserValidationService {
 *   constructor(
 *     private birthdateValidator: UserBirthdateValidatorUseCase,
 *     private emailValidator: UserEmailValidatorUseCase,
 *     private passwordValidator: UserPasswordValidatorUseCase
 *   ) {}
 *
 *   validateUserData(userData) {
 *     // Aciona validadores específicos para cada campo
 *     this.emailValidator.validate(userData.email);
 *     this.passwordValidator.validate(userData.password);
 *
 *     if (userData.birthdate) {
 *       this.birthdateValidator.validate(userData.birthdate);
 *     }
 *
 *     // Todos os dados são válidos se chegou até aqui
 *     return true;
 *   }
 * }
 *
 */

export * from "./user-birthdate-validator";
export * from "./user-phone-validator";
export * from "./user-email-validator";
export * from "./user-password-validator";
export * from "./user-unique-email-validator";
export * from "./user-create-data-validator";
