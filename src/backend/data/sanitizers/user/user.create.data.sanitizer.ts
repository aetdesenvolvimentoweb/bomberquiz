import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";

export class UserCreateDataSanitizer implements UserCreateDataSanitizerUseCase {
  /**
   * Sanitiza os dados de entrada do usuário
   * @param data Dados do usuário a serem sanitizados
   * @returns Dados sanitizados
   * @public
   */
  public readonly sanitize = (data: UserCreateData): UserCreateData => {
    // Cria um novo objeto com os mesmos campos do original
    const sanitized = { ...data };

    // Sanitiza cada campo individualmente
    if (typeof data.name === "string") {
      sanitized.name = this.sanitizeName(data.name);
    }

    if (typeof data.email === "string") {
      sanitized.email = this.sanitizeEmail(data.email);
    }

    if (typeof data.phone === "string") {
      sanitized.phone = this.sanitizePhone(data.phone);
    }

    if (typeof data.password === "string") {
      sanitized.password = this.sanitizePassword(data.password);
    }

    // Não sanitiza a data de nascimento

    return sanitized;
  };

  /**
   * Sanitiza o nome do usuário
   * @param name Nome do usuário
   * @returns Nome sanitizado
   * @private
   */
  private sanitizeName(name: string): string {
    return name.trim();
  }

  /**
   * Sanitiza o email do usuário
   * @param email Email do usuário
   * @returns Email sanitizado
   * @private
   */
  private sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Sanitiza o telefone do usuário
   * @param phone Telefone do usuário
   * @returns Telefone sanitizado
   * @private
   */
  private sanitizePhone(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  /**
   * Sanitiza a senha do usuário
   * @param password Senha do usuário
   * @returns Senha sanitizada
   * @private
   */
  private sanitizePassword(password: string): string {
    return password.trim();
  }
}
