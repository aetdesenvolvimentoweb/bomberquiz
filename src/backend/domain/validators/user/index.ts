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
 * // Importação simplificada
 * import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators/user";
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private birthdateValidator: UserBirthdateValidatorUseCase) {}
 *
 *   createUser(userData) {
 *     // Valida a data de nascimento antes de prosseguir
 *     this.birthdateValidator.validate(userData.birthdate);
 *     // Continua o processamento...
 *   }
 * }
 *
 */

export * from "./user-birthdate-validator";
