/**
 * Módulo de exportação para validadores do domínio
 *
 * Este arquivo centraliza a exportação de todos os validadores da aplicação,
 * seguindo o padrão de barril (barrel pattern). Isso permite importar qualquer
 * validador a partir de um único ponto de entrada, simplificando as importações
 * em outros módulos.
 *
 * Os validadores são responsáveis por garantir que os dados atendam aos
 * requisitos de negócio e restrições do sistema antes de serem processados
 * pela lógica de negócio. Esta camada ajuda a manter a integridade dos dados
 * e prevenir estados inválidos no sistema.
 *
 * @module domain/validators
 *
 * @example
 *
 * // Importação simplificada de validadores
 * import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators";
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private birthdateValidator: UserBirthdateValidatorUseCase) {}
 *
 *   createUser(userData) {
 *     // Valida os dados antes de processá-los
 *     this.birthdateValidator.validate(userData.birthdate);
 *     // Continua o processamento...
 *   }
 * }
 *
 */

export * from "./user";
