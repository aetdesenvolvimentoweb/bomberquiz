/**
 * Interface para validação de unicidade de e-mail de usuário
 *
 * Define o contrato para implementações que verificam se um endereço de e-mail
 * já está em uso no sistema. Esta validação é essencial durante o cadastro
 * de novos usuários ou atualização de e-mail de usuários existentes para
 * garantir que cada e-mail seja único no sistema.
 *
 * @remarks
 * A validação de unicidade de e-mail é importante para:
 * - Evitar duplicação de contas de usuário
 * - Garantir que o e-mail possa ser usado como identificador único
 * - Prevenir conflitos em processos como recuperação de senha
 *
 * Esta interface segue o princípio de inversão de dependência (DIP) do SOLID,
 * permitindo que a camada de domínio defina o contrato enquanto a implementação
 * concreta é fornecida pela camada de infraestrutura, geralmente utilizando
 * um repositório para consultar o banco de dados.
 *
 * Diferente de outras validações, este método é assíncrono (retorna uma Promise)
 * porque precisa consultar um repositório de dados para verificar a existência
 * do e-mail.
 *
 * @example
 *
 * // Exemplo de implementação usando um repositório
 * class UserUniqueEmailValidator implements UserUniqueEmailValidatorUseCase {
 *   constructor(private userRepository: UserRepository) {}
 *
 *   async validate(email: string): Promise<void> {
 *     // Verifica se o e-mail já existe no repositório
 *     const existingUser = await this.userRepository.findByEmail(email);
 *
 *     // Se encontrou um usuário, o e-mail não é único
 *     if (existingUser) {
 *       throw new DuplicateResourceError("e-mail");
 *     }
 *   }
 * }
 *
 * // Uso em um caso de uso
 * class CreateUserUseCase {
 *   constructor(
 *     private userRepository: UserRepository,
 *     private emailValidator: UserEmailValidatorUseCase,
 *     private uniqueEmailValidator: UserUniqueEmailValidatorUseCase
 *   ) {}
 *
 *   async execute(userData: UserCreateData): Promise<User> {
 *     // Valida o formato do e-mail
 *     this.emailValidator.validate(userData.email);
 *
 *     // Valida a unicidade do e-mail
 *     await this.uniqueEmailValidator.validate(userData.email);
 *
 *     // Continua com a criação do usuário...
 *     return this.userRepository.create(userData);
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserUniqueEmailValidatorUseCase {
  /**
   * Valida se um endereço de e-mail é único no sistema
   *
   * @param {string} email - Endereço de e-mail a ser verificado
   * @returns {Promise<void>} Promise que resolve se o e-mail for único, ou rejeita com erro caso contrário
   *
   * @throws {DuplicateResourceError} Quando o e-mail já está em uso por outro usuário
   */
  validate: (email: string) => Promise<void>;
}
