import { UserEmailValidatorUseCase } from "@/backend/domain/validators";
import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import validator from "validator";

/**
 * Implementação concreta do validador de e-mail usando a biblioteca validator
 *
 * Esta classe implementa a lógica de validação de endereços de e-mail,
 * verificando formato, comprimento e opcionalmente domínios permitidos/bloqueados.
 *
 * @implements {UserEmailValidatorUseCase}
 */
export class ValidatorEmailValidator implements UserEmailValidatorUseCase {
  /**
   * Lista de domínios bloqueados (ex: domínios temporários ou gratuitos)
   */
  private readonly blockedDomains: string[];

  /**
   * Comprimento máximo permitido para o e-mail
   */
  private readonly maxLength: number;

  /**
   * Cria uma nova instância do validador de e-mail
   *
   * @param {object} options - Opções de configuração para o validador
   * @param {string[]} options.blockedDomains - Lista de domínios bloqueados (padrão: [])
   * @param {number} options.maxLength - Comprimento máximo do e-mail (padrão: 255)
   */
  constructor(options?: { blockedDomains?: string[]; maxLength?: number }) {
    this.blockedDomains = options?.blockedDomains || [];
    this.maxLength = options?.maxLength || 255;
  }

  /**
   * Valida um endereço de e-mail
   *
   * @param {string} email - Endereço de e-mail a ser validado
   * @returns {void} Não retorna valor, mas lança exceção se o e-mail for inválido
   * @throws {MissingParamError} Quando o e-mail não é fornecido
   * @throws {InvalidParamError} Quando o e-mail não atende aos critérios de validação
   */
  validate(email: string): void {
    // Verifica se o e-mail foi fornecido
    if (!email || email.trim() === "") {
      throw new MissingParamError("e-mail");
    }

    // Verifica o comprimento máximo
    if (email.length > this.maxLength) {
      throw new InvalidParamError(
        "e-mail",
        `excede o tamanho máximo permitido de ${this.maxLength} caracteres`,
      );
    }

    // Verifica se o formato é válido usando a biblioteca validator
    if (!validator.isEmail(email)) {
      throw new InvalidParamError("e-mail", "formato inválido");
    }

    // Verifica se o domínio está na lista de bloqueados
    if (this.blockedDomains.length > 0) {
      const domain = email.split("@")[1].toLowerCase();
      if (this.blockedDomains.includes(domain)) {
        throw new InvalidParamError("e-mail", "domínio não permitido");
      }
    }
  }
}
