/**
 * Testes unitários para a classe ValidatorEmailValidator
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * ValidatorEmailValidator do contrato UserEmailValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { ValidatorEmailValidator } from "@/backend/infra/adapters";
import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";

describe("ValidatorEmailValidator", () => {
  let emailValidator: ValidatorEmailValidator;

  beforeEach(() => {
    // Cria uma nova instância do validador com configurações padrão
    emailValidator = new ValidatorEmailValidator();
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

    it("deve lançar MissingParamError quando o e-mail não é fornecido", () => {
      // Arrange
      const emptyEmails = ["", null, undefined] as string[];

      // Act & Assert
      emptyEmails.forEach((email) => {
        expect(() => emailValidator.validate(email as string)).toThrow(
          MissingParamError,
        );
        expect(() => emailValidator.validate(email as string)).toThrow(
          "Parâmetro obrigatório não informado: e-mail",
        );
      });
    });

    it("deve lançar InvalidParamError quando o e-mail excede o comprimento máximo", () => {
      // Arrange
      const maxLength = 50; // Valor menor para facilitar o teste
      const validator = new ValidatorEmailValidator({ maxLength });
      const errorReason = `excede o tamanho máximo permitido de ${maxLength} caracteres`;

      // Cria um e-mail muito longo (maior que maxLength)
      const longLocalPart = "a".repeat(maxLength);
      const longEmail = `${longLocalPart}@example.com`;

      // Act & Assert
      expect(() => validator.validate(longEmail)).toThrow(InvalidParamError);
      expect(() => validator.validate(longEmail)).toThrow(
        new InvalidParamError("e-mail", errorReason),
      );
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

    it("deve lançar InvalidParamError quando o domínio está bloqueado", () => {
      // Arrange
      const blockedDomains = ["temporarymail.com", "disposable.com"];
      const validator = new ValidatorEmailValidator({ blockedDomains });

      const emailsWithBlockedDomains = [
        "user@temporarymail.com",
        "another@disposable.com",
      ];
      const errorReason = "domínio não permitido";

      // Act & Assert
      emailsWithBlockedDomains.forEach((email) => {
        expect(() => validator.validate(email)).toThrow(InvalidParamError);
        expect(() => validator.validate(email)).toThrow(
          new InvalidParamError("e-mail", errorReason),
        );
      });
    });
  });

  describe("configuração personalizada", () => {
    it("deve usar o comprimento máximo personalizado quando especificado", () => {
      // Arrange
      const maxLength = 20;
      const validator = new ValidatorEmailValidator({ maxLength });

      const validEmail = "short@example.com"; // Menos de 20 caracteres
      const longEmail = "verylongemailaddress@example.com"; // Mais de 20 caracteres
      const errorReason = `excede o tamanho máximo permitido de ${maxLength} caracteres`;

      // Act & Assert
      expect(() => validator.validate(validEmail)).not.toThrow();
      expect(() => validator.validate(longEmail)).toThrow(InvalidParamError);
      expect(() => validator.validate(longEmail)).toThrow(
        new InvalidParamError("e-mail", errorReason),
      );
    });

    it("deve usar a lista de domínios bloqueados fornecida", () => {
      // Arrange
      const blockedDomains = ["custom-blocked.com"];
      const validator = new ValidatorEmailValidator({ blockedDomains });
      const errorReason = "domínio não permitido";

      // E-mail com domínio bloqueado personalizado
      const blockedEmail = "user@custom-blocked.com";

      // E-mail com domínio não bloqueado
      const allowedEmail = "user@allowed-domain.com";

      // Act & Assert
      expect(() => validator.validate(blockedEmail)).toThrow(InvalidParamError);
      expect(() => validator.validate(blockedEmail)).toThrow(
        new InvalidParamError("e-mail", errorReason),
      );

      expect(() => validator.validate(allowedEmail)).not.toThrow();
    });

    it("deve aceitar configurações personalizadas combinadas", () => {
      // Arrange
      const options = {
        maxLength: 25,
        blockedDomains: ["blocked.com"],
      };
      const validator = new ValidatorEmailValidator(options);

      // E-mail muito longo
      const longEmail = "verylongemailaddress@example.com";

      // E-mail com domínio bloqueado
      const blockedDomainEmail = "user@blocked.com";

      // E-mail válido
      const validEmail = "valid@example.com";

      // Act & Assert
      expect(() => validator.validate(longEmail)).toThrow(
        new InvalidParamError(
          "e-mail",
          "excede o tamanho máximo permitido de 25 caracteres",
        ),
      );
      expect(() => validator.validate(blockedDomainEmail)).toThrow(
        new InvalidParamError("e-mail", "domínio não permitido"),
      );
      expect(() => validator.validate(validEmail)).not.toThrow();
    });
  });

  describe("casos de borda", () => {
    it("deve verificar corretamente domínios com diferentes casos", () => {
      // Arrange
      const blockedDomains = ["blocked.com"];
      const validator = new ValidatorEmailValidator({ blockedDomains });
      const errorReason = "domínio não permitido";

      // E-mail com domínio bloqueado em maiúsculas
      const upperCaseDomainEmail = "user@BLOCKED.COM";

      // Act & Assert
      expect(() => validator.validate(upperCaseDomainEmail)).toThrow(
        new InvalidParamError("e-mail", errorReason),
      );
    });
  });
});
