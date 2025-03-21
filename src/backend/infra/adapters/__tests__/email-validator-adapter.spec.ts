/**
 * Testes unitários para a classe ValidatorEmailValidatorAdapter
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * ValidatorEmailValidatorAdapter do contrato UserEmailValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { ValidatorEmailValidatorAdapter } from "@/backend/infra/adapters";
import { InvalidParamError } from "@/backend/domain/errors";

describe("ValidatorEmailValidatorAdapter", () => {
  let emailValidator: ValidatorEmailValidatorAdapter;

  beforeEach(() => {
    // Cria uma nova instância do validador com configurações padrão
    emailValidator = new ValidatorEmailValidatorAdapter();
  });

  describe("validate method", () => {
    it("deve aceitar um e-mail válido", () => {
      // Arrange
      const validEmails = [
        "test@example.com",
        "user.name@domain.com",
        "user+tag@example.org",
        "user-name@domain.co.uk",
      ];

      // Act & Assert
      validEmails.forEach((email) => {
        expect(() => emailValidator.validate(email)).not.toThrow();
      });
    });

    it("deve lançar InvalidParamError quando o formato do e-mail é inválido", () => {
      // Arrange
      const invalidEmails = [
        "plainaddress",
        "@missingusername.com",
        "username@.com",
        "username@domain",
        "username@domain..com",
      ];
      const errorReason = "formato inválido";

      // Act & Assert
      invalidEmails.forEach((email) => {
        expect(() => emailValidator.validate(email)).toThrow(InvalidParamError);
        expect(() => emailValidator.validate(email)).toThrow(
          new InvalidParamError("e-mail", errorReason),
        );
      });
    });
  });
});
