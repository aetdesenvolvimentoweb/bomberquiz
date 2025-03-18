import { UserCreateData } from "@/backend/domain/entities";

/**
 * Interface para sanitização de dados de criação de usuário
 *
 * Define o contrato para classes que implementam a lógica de sanitização
 * dos dados fornecidos durante a criação de um usuário. A sanitização
 * pode incluir normalização de formatos, remoção de espaços em branco,
 * padronização de valores, entre outros tratamentos.
 *
 * @remarks
 * A sanitização é uma etapa importante que ocorre antes da validação
 * dos dados, permitindo que entradas válidas em diferentes formatos
 * sejam normalizadas para um formato padrão. Isso melhora a experiência
 * do usuário e reduz erros de validação desnecessários.
 *
 * Exemplos de sanitização incluem:
 * - Normalização de e-mails (converter para minúsculas)
 * - Remoção de espaços em branco extras
 * - Formatação de números de telefone
 * - Padronização de nomes (capitalização adequada)
 *
 * @example
 *
 * class UserCreateDataSanitizer implements UserCreateDataSanitizerUseCase {
 *   sanitize(data: UserCreateData): UserCreateData {
 *     return {
 *       ...data,
 *       email: data.email?.trim().toLowerCase(),
 *       name: data.name?.trim()
 *     };
 *   }
 * }
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(
 *     private sanitizer: UserCreateDataSanitizerUseCase,
 *     private validator: UserValidator
 *   ) {}
 *
 *   async createUser(rawData: UserCreateData) {
 *     // Sanitiza os dados antes da validação
 *     const sanitizedData = this.sanitizer.sanitize(rawData);
 *
 *     // Valida os dados sanitizados
 *     this.validator.validate(sanitizedData);
 *
 *     // Continua com a criação do usuário...
 *   }
 * }
 *
 *
 * @interface
 */
export interface UserCreateDataSanitizerUseCase {
  /**
   * Sanitiza os dados de criação de usuário
   *
   * @param {UserCreateData} data - Dados brutos de criação de usuário
   * @returns {UserCreateData} Dados sanitizados prontos para validação
   */
  sanitize: (data: UserCreateData) => UserCreateData;
}
