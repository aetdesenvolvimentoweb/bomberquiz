/**
 * Interface para validação de endereço de e-mail de usuário
 *
 * Define o contrato para implementações que validam o endereço de e-mail
 * fornecido durante o cadastro ou atualização de um usuário. Esta interface
 * segue o princípio de inversão de dependência (DIP), permitindo que a camada
 * de domínio defina o contrato enquanto a implementação concreta é fornecida
 * pela camada de infraestrutura, possivelmente utilizando bibliotecas de terceiros.
 *
 * @remarks
 * A validação de e-mail é importante para:
 * - Garantir que o sistema possa se comunicar efetivamente com o usuário
 * - Prevenir erros de entrada de dados
 * - Reduzir tentativas de cadastro com e-mails falsos ou inválidos
 *
 * Implementações desta interface na camada de infraestrutura podem utilizar
 * bibliotecas especializadas como validator.js, email-validator, ou outras
 * soluções que forneçam validação robusta de e-mail.
 *
 * @example
 *
 * // Exemplo de implementação na camada de infraestrutura usando validator.js
 * import validator from 'validator';
 *
 * export class EmailValidator implements UserEmailValidatorUseCase {
 *   validate(email: string): void {
 *     // Verifica se o e-mail foi fornecido
 *     if (!email || email.trim() === '') {
 *       throw new MissingParamError("e-mail");
 *     }
 *
 *     // Utiliza biblioteca de terceiros para validação robusta
 *     if (!validator.isEmail(email)) {
 *       throw new InvalidParamError("e-mail", "formato inválido");
 *     }
 *
 *     // Regras de negócio adicionais específicas da aplicação
 *     const domain = email.split('@')[1];
 *     const blockedDomains = ['temporarymail.com', 'disposable.com'];
 *     if (blockedDomains.includes(domain)) {
 *       throw new InvalidParamError("e-mail", "domínio não permitido");
 *     }
 *   }
 * }
 *
 *
 * @example
 *
 * // Uso em um caso de uso na camada de aplicação
 * export class CreateUserUseCase {
 *   constructor(
 *     private userRepository: UserRepository,
 *     private emailValidator: UserEmailValidatorUseCase
 *   ) {}
 *
 *   async execute(userData: UserCreateData): Promise<User> {
 *     // Valida o endereço de e-mail usando a implementação injetada
 *     this.emailValidator.validate(userData.email);
 *
 *     // Verifica se já existe usuário com este e-mail
 *     const existingUser = await this.userRepository.findByEmail(userData.email);
 *     if (existingUser) {
 *       throw new DuplicateResourceError("e-mail");
 *     }
 *
 *     // Continua com a criação do usuário...
 *     return this.userRepository.create(userData);
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserEmailValidatorUseCase {
  /**
   * Valida o endereço de e-mail de um usuário
   *
   * @param {string} email - Endereço de e-mail a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o e-mail for inválido
   *
   * @throws {MissingParamError} Quando o e-mail não é fornecido
   * @throws {InvalidParamError} Quando o e-mail não atende aos critérios de validação
   */
  validate: (email: string) => void;
}
