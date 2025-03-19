/**
 * Interface para validação de data de nascimento de usuário
 *
 * Define o contrato para implementações que validam a data de nascimento
 * fornecida durante o cadastro ou atualização de um usuário. A validação
 * pode incluir verificações como:
 * - Idade mínima permitida 18 anos
 * - Idade máxima razoável 65 anos
 * - Data no passado (não no futuro)
 * - Formato válido de data
 *
 * @remarks
 * A validação de data de nascimento é importante para:
 * - Garantir conformidade com requisitos legais (ex: idade mínima para uso do serviço)
 * - Prevenir erros de entrada de dados
 * - Manter a integridade dos dados do usuário
 *
 * Implementações desta interface devem lançar exceções apropriadas quando
 * a data de nascimento não atender aos critérios de validação.
 *
 * @example
 *
 * class UserBirthdateValidator implements UserBirthdateValidatorUseCase {
 *   private readonly MIN_AGE_YEARS = 13;
 *   private readonly MAX_AGE_YEARS = 120;
 *
 *   validate(birthdate: Date): void {
 *     const today = new Date();
 *
 *     // Verifica se a data está no futuro
 *     if (birthdate > today) {
 *       throw new InvalidParamError("data de nascimento", "não pode ser no futuro");
 *     }
 *
 *     // Calcula a idade
 *     const age = today.getFullYear() - birthdate.getFullYear();
 *     const hasBirthdayOccurred =
 *       today.getMonth() > birthdate.getMonth() ||
 *       (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());
 *     const actualAge = hasBirthdayOccurred ? age : age - 1;
 *
 *     // Verifica idade mínima
 *     if (actualAge < this.MIN_AGE_YEARS) {
 *       throw new InvalidParamError(
 *         "data de nascimento",
 *         `usuário deve ter pelo menos ${this.MIN_AGE_YEARS} anos`
 *       );
 *     }
 *
 *     // Verifica idade máxima
 *     if (actualAge > this.MAX_AGE_YEARS) {
 *       throw new InvalidParamError(
 *         "data de nascimento",
 *         `idade excede o limite máximo de ${this.MAX_AGE_YEARS} anos`
 *       );
 *     }
 *   }
 * }
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private birthdateValidator: UserBirthdateValidatorUseCase) {}
 *
 *   createUser(userData: UserCreateData) {
 *     // Valida a data de nascimento
 *     this.birthdateValidator.validate(userData.birthdate);
 *
 *     // Continua com a criação do usuário...
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserBirthdateValidatorUseCase {
  /**
   * Valida a data de nascimento de um usuário
   *
   * @param {Date} birthdate - Data de nascimento a ser validada
   * @returns {void} Não retorna valor, mas lança exceção se a data for inválida
   *
   * @throws {InvalidParamError} Quando a data de nascimento não atende aos critérios de validação
   */
  validate: (birthdate: Date) => void;
}
