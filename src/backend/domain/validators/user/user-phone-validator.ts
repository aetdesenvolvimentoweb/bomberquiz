/**
 * Interface para validação de número de telefone de usuário
 *
 * Define o contrato para implementações que validam o número de telefone
 * fornecido durante o cadastro ou atualização de um usuário. A validação
 * pode incluir verificações como:
 * - Formato válido de número de telefone
 * - Presença de código de país
 * - Comprimento adequado do número
 * - Caracteres permitidos (dígitos, '+', '-', espaços)
 *
 * @remarks
 * A validação de número de telefone é importante para:
 * - Garantir que o sistema possa se comunicar efetivamente com o usuário
 * - Prevenir erros de entrada de dados
 * - Manter a integridade dos dados de contato
 *
 * Implementações desta interface devem lançar exceções apropriadas quando
 * o número de telefone não atender aos critérios de validação.
 *
 * @example
 *
 * class UserPhoneValidator implements UserPhoneValidatorUseCase {
 *   validate(phone: string): void {
 *     // Verifica se o telefone foi fornecido
 *     if (!phone || phone.trim() === '') {
 *       throw new MissingParamError("telefone");
 *     }
 *
 *     // Remove caracteres de formatação para validação
 *     const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
 *
 *     // Verifica se contém apenas dígitos e possivelmente um '+' no início
 *     if (!/^\+?\d+$/.test(cleanPhone)) {
 *       throw new InvalidParamError(
 *         "telefone",
 *         "deve conter apenas dígitos, possivelmente com um '+' no início"
 *       );
 *     }
 *
 *     // Verifica comprimento mínimo (ex: +55 11 91234-5678 -> 13 dígitos)
 *     if (cleanPhone.length < 8) {
 *       throw new InvalidParamError(
 *         "telefone",
 *         "número muito curto"
 *       );
 *     }
 *
 *     // Verifica comprimento máximo para evitar dados incorretos
 *     if (cleanPhone.length > 15) {
 *       throw new InvalidParamError(
 *         "telefone",
 *         "número muito longo"
 *       );
 *     }
 *   }
 * }
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private phoneValidator: UserPhoneValidatorUseCase) {}
 *
 *   updateUserPhone(userId: string, phone: string) {
 *     // Valida o número de telefone
 *     this.phoneValidator.validate(phone);
 *
 *     // Continua com a atualização do telefone...
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserPhoneValidatorUseCase {
  /**
   * Valida o número de telefone de um usuário
   *
   * @param {string} phone - Número de telefone a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o número for inválido
   *
   * @throws {MissingParamError} Quando o número de telefone não é fornecido
   * @throws {InvalidParamError} Quando o número de telefone não atende aos critérios de validação
   */
  validate: (phone: string) => void;
}
