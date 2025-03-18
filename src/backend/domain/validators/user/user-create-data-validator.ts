import { UserCreateData } from "@/backend/domain/entities";

/**
 * Interface para validação completa de dados de criação de usuário
 *
 * Define o contrato para implementações que coordenam a validação de todos
 * os campos necessários para a criação de um usuário. Este validador atua como
 * um orquestrador que aciona validadores específicos para cada campo, garantindo
 * que todos os dados atendam aos requisitos do sistema.
 *
 * @remarks
 * Este validador segue o padrão Composite, agregando múltiplos validadores
 * especializados para criar uma validação abrangente. Ele é responsável por:
 *
 * - Coordenar a ordem das validações
 * - Garantir que todos os campos obrigatórios sejam validados
 * - Acionar validadores específicos para cada tipo de dado (email, senha, etc.)
 * - Verificar regras de negócio que envolvem múltiplos campos
 *
 * Por ser um validador de alto nível que pode precisar acessar o repositório
 * para verificações de unicidade, seu método de validação é assíncrono.
 *
 * @example
 *
 * // Implementação que orquestra múltiplos validadores
 * class UserCreateDataValidator implements UserCreateDataValidatorUseCase {
 *   constructor(
 *     private emailValidator: UserEmailValidatorUseCase,
 *     private passwordValidator: UserPasswordValidatorUseCase,
 *     private phoneValidator: UserPhoneValidatorUseCase,
 *     private birthdateValidator: UserBirthdateValidatorUseCase,
 *     private uniqueEmailValidator: UserUniqueEmailValidatorUseCase
 *   ) {}
 *
 *   async validate(data: UserCreateData): Promise<void> {
 *     // Verifica se os dados foram fornecidos
 *     if (!data) {
 *       throw new MissingParamError("dados do usuário");
 *     }
 *
 *     // Valida campos obrigatórios
 *     if (!data.name || data.name.trim() === '') {
 *       throw new MissingParamError("nome");
 *     }
 *
 *     // Aciona validadores específicos para cada campo
 *     this.emailValidator.validate(data.email);
 *     this.passwordValidator.validate(data.password);
 *
 *     // Valida campos opcionais se fornecidos
 *     if (data.phone) {
 *       this.phoneValidator.validate(data.phone);
 *     }
 *
 *     if (data.birthdate) {
 *       this.birthdateValidator.validate(data.birthdate);
 *     }
 *
 *     // Verifica regras de negócio específicas para criação
 *     if (data.password !== data.passwordConfirmation) {
 *       throw new InvalidParamError(
 *         "confirmação de senha",
 *         "não corresponde à senha informada"
 *       );
 *     }
 *
 *     // Realiza validações assíncronas (unicidade)
 *     await this.uniqueEmailValidator.validate(data.email);
 *   }
 * }
 *
 * // Uso em um caso de uso
 * class CreateUserUseCase {
 *   constructor(
 *     private userRepository: UserRepository,
 *     private validator: UserCreateDataValidatorUseCase,
 *     private sanitizer: UserCreateDataSanitizerUseCase
 *   ) {}
 *
 *   async execute(rawData: UserCreateData): Promise<User> {
 *     // Sanitiza os dados antes da validação
 *     const sanitizedData = this.sanitizer.sanitize(rawData);
 *
 *     // Valida todos os dados de uma vez
 *     await this.validator.validate(sanitizedData);
 *
 *     // Continua com a criação do usuário...
 *     return this.userRepository.create(sanitizedData);
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserCreateDataValidatorUseCase {
  /**
   * Valida todos os dados necessários para a criação de um usuário
   *
   * @param {UserCreateData} data - Dados de criação do usuário a serem validados
   * @returns {Promise<void>} Promise que resolve se todos os dados forem válidos, ou rejeita com erro caso contrário
   *
   * @throws {MissingParamError} Quando campos obrigatórios não são fornecidos
   * @throws {InvalidParamError} Quando campos não atendem aos critérios de validação
   * @throws {DuplicateResourceError} Quando há violação de unicidade (ex: e-mail já cadastrado)
   */
  validate: (data: UserCreateData) => Promise<void>;
}
