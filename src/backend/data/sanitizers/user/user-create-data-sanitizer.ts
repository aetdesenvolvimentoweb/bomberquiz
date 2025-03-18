import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers/user";
import { XssSanitizerUseCase } from "@/backend/domain/sanitizers/security";

/**
 * Implementação concreta do sanitizador de dados de criação de usuário
 *
 * Esta classe implementa a lógica de sanitização dos dados fornecidos
 * durante a criação de um usuário, normalizando formatos, removendo espaços
 * em branco desnecessários e protegendo contra ataques XSS.
 *
 * @implements {UserCreateDataSanitizerUseCase}
 */
export class UserCreateDataSanitizer implements UserCreateDataSanitizerUseCase {
  /**
   * Cria uma nova instância do UserCreateDataSanitizer
   *
   * @param {XssSanitizerUseCase} xssSanitizer - Sanitizador para proteção contra XSS
   */
  constructor(private readonly xssSanitizer: XssSanitizerUseCase) {}

  /**
   * Sanitiza os dados de criação de usuário
   *
   * @param {UserCreateData} data - Dados brutos de criação de usuário
   * @returns {UserCreateData} Dados sanitizados prontos para validação
   */
  sanitize(data: UserCreateData): UserCreateData {
    if (!data) {
      return {} as UserCreateData;
    }

    return {
      ...data,
      // Normaliza o e-mail: remove espaços e converte para minúsculas
      email: this.sanitizeEmail(data.email),

      // Sanitiza o nome: remove espaços extras e protege contra XSS
      name: this.sanitizeName(data.name),

      // Sanitiza o telefone: remove caracteres não numéricos, exceto o '+'
      phone: this.sanitizePhone(data.phone),

      // A senha não é sanitizada para preservar caracteres especiais
      password: data.password,

      // A data de nascimento não precisa de sanitização específica
      birthdate: data.birthdate,
    };
  }

  /**
   * Sanitiza um endereço de e-mail
   *
   * @param {string} email - E-mail a ser sanitizado
   * @returns {string} E-mail sanitizado
   */
  private sanitizeEmail(email: string): string {
    if (!email) return "";

    // Remove espaços e converte para minúsculas
    return email.trim().toLowerCase();
  }

  /**
   * Sanitiza um nome de usuário
   *
   * @param {string} name - Nome a ser sanitizado
   * @returns {string} Nome sanitizado
   */
  private sanitizeName(name: string): string {
    if (!name) return "";

    // Remove espaços extras no início e fim
    const trimmedName = name.trim();

    // Normaliza espaços internos (substitui múltiplos espaços por um único)
    const normalizedName = trimmedName.replace(/\s+/g, " ");

    // Protege contra XSS
    return this.xssSanitizer.sanitize(normalizedName);
  }

  /**
   * Sanitiza um número de telefone
   *
   * @param {string} phone - Telefone a ser sanitizado
   * @returns {string} Telefone sanitizado
   */
  private sanitizePhone(phone: string): string {
    if (!phone) return "";

    // Remove espaços
    const trimmedPhone = phone.trim();

    // Mantém apenas dígitos e o caractere '+' (para código de país)
    // Exemplo: converte "(11) 98765-4321" para "11987654321"
    // Ou "+55 (11) 98765-4321" para "+5511987654321"
    return trimmedPhone.replace(/[^\d+]/g, "");
  }
}
