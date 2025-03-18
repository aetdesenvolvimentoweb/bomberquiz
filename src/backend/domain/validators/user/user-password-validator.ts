/**
 * Interface para validação de senha de usuário
 *
 * Define o contrato para implementações que validam a senha
 * fornecida durante o cadastro ou atualização de um usuário. Esta interface
 * segue o princípio de inversão de dependência (DIP), permitindo que a camada
 * de domínio defina o contrato enquanto a implementação concreta é fornecida
 * pela camada de infraestrutura.
 *
 * @remarks
 * A validação de senha é crucial para a segurança da aplicação e pode incluir verificações como:
 * - Comprimento mínimo (ex: 8 caracteres)
 * - Complexidade (presença de letras maiúsculas, minúsculas, números e caracteres especiais)
 * - Ausência de padrões comuns ou facilmente adivináveis
 * - Não conter informações pessoais do usuário (como nome ou e-mail)
 * - Não estar em listas de senhas comprometidas
 *
 * Implementações desta interface devem lançar exceções apropriadas quando
 * a senha não atender aos critérios de validação.
 *
 * @example
 *
 * // Exemplo de implementação com regras de complexidade
 * class UserPasswordValidator implements UserPasswordValidatorUseCase {
 *   private readonly MIN_LENGTH = 8;
 *
 *   validate(password: string): void {
 *     // Verifica se a senha foi fornecida
 *     if (!password || password.trim() === '') {
 *       throw new MissingParamError("senha");
 *     }
 *
 *     // Verifica comprimento mínimo
 *     if (password.length < this.MIN_LENGTH) {
 *       throw new InvalidParamError(
 *         "senha",
 *         `deve ter pelo menos ${this.MIN_LENGTH} caracteres`
 *       );
 *     }
 *
 *     // Verifica presença de letra maiúscula
 *     if (!/[A-Z]/.test(password)) {
 *       throw new InvalidParamError(
 *         "senha",
 *         "deve conter pelo menos uma letra maiúscula"
 *       );
 *     }
 *
 *     // Verifica presença de letra minúscula
 *     if (!/[a-z]/.test(password)) {
 *       throw new InvalidParamError(
 *         "senha",
 *         "deve conter pelo menos uma letra minúscula"
 *       );
 *     }
 *
 *     // Verifica presença de número
 *     if (!/[0-9]/.test(password)) {
 *       throw new InvalidParamError(
 *         "senha",
 *         "deve conter pelo menos um número"
 *       );
 *     }
 *
 *     // Verifica presença de caractere especial
 *     if (!/[^A-Za-z0-9]/.test(password)) {
 *       throw new InvalidParamError(
 *         "senha",
 *         "deve conter pelo menos um caractere especial"
 *       );
 *     }
 *   }
 * }
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private passwordValidator: UserPasswordValidatorUseCase) {}
 *
 *   createUser(userData) {
 *     // Valida a senha
 *     this.passwordValidator.validate(userData.password);
 *
 *     // Continua com a criação do usuário...
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserPasswordValidatorUseCase {
  /**
   * Valida a senha de um usuário
   *
   * @param {string} password - Senha a ser validada
   * @returns {void} Não retorna valor, mas lança exceção se a senha for inválida
   *
   * @throws {MissingParamError} Quando a senha não é fornecida
   * @throws {InvalidParamError} Quando a senha não atende aos critérios de validação
   */
  validate: (password: string) => void;
}
