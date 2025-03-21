import PasswordValidator from "password-validator";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";

/**
 * Implementação concreta do validador de senha de usuário
 * usando a biblioteca password-validator
 *
 * Esta classe implementa a lógica de validação de senha com base
 * em regras de segurança recomendadas, como comprimento mínimo,
 * presença de caracteres maiúsculos, minúsculos, números e especiais.
 *
 * @implements {UserPasswordValidatorUseCase}
 */
export class PasswordValidatorAdapter implements UserPasswordValidatorUseCase {
  /**
   * Esquema de validação com regras pré-configuradas
   */
  private readonly schema: PasswordValidator;

  /**
   * Constrói uma instância do validador com as regras configuradas
   */
  constructor() {
    this.schema = new PasswordValidator();

    // Configura as regras de validação
    this.schema
      .is()
      .min(8) // Mínimo de 8 caracteres
      .has()
      .uppercase() // Deve ter pelo menos uma letra maiúscula
      .has()
      .lowercase() // Deve ter pelo menos uma letra minúscula
      .has()
      .digits() // Deve ter pelo menos um número
      .has()
      .symbols() // Deve ter pelo menos um caractere especial
      .has()
      .not()
      .spaces() // Não deve conter espaços
      .is()
      .not()
      .oneOf([
        // Lista negra de senhas comuns
        "Password123",
        "Admin123!",
        "12345678",
        "Senha123!",
        "Abc123!@#",
      ]);
  }

  /**
   * Valida a senha de acordo com as regras configuradas
   *
   * @param {string} password - Senha a ser validada
   * @returns {void} Não retorna valor, mas lança exceção se a senha for inválida
   *
   * @throws {MissingParamError} Quando a senha não é fornecida
   * @throws {InvalidParamError} Quando a senha não atende aos critérios de validação
   */
  validate(password: string): void {
    try {
      // Valida a senha contra o esquema e obtém as falhas
      const validationFailures = this.schema.validate(password, {
        list: true,
      }) as string[];

      // Se houver falhas, lança exceção com a primeira falha
      if (validationFailures.length > 0) {
        const errorMessageMap: Record<string, string> = {
          min: "deve ter pelo menos 8 caracteres",
          uppercase: "deve conter pelo menos uma letra maiúscula",
          lowercase: "deve conter pelo menos uma letra minúscula",
          digits: "deve conter pelo menos um número",
          symbols: "deve conter pelo menos um caractere especial",
          spaces: "não deve conter espaços",
          oneOf: "é muito comum ou previsível",
        };

        const failureType = validationFailures[0];
        const errorMessage = errorMessageMap[failureType];

        throw new InvalidParamError("senha", errorMessage);
      }
    } catch (error) {
      // Se o erro já é um ServerError ou um InvalidParamError, propaga
      if (error instanceof ServerError || error instanceof InvalidParamError) {
        throw error;
      }

      // Para outros erros da biblioteca, converte para ServerError
      throw new ServerError(error as Error);
    }
  }
}
