/**
 * Testes unitários para a classe DateFnsBirthdateValidator
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * DateFnsBirthdateValidator do contrato UserBirthdateValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { DateFnsBirthdateValidator } from "@/backend/infra/adapters";
import { InvalidParamError } from "@/backend/domain/errors";
import { subYears, addDays } from "date-fns";

describe("DateFnsBirthdateValidator", () => {
  let validator: DateFnsBirthdateValidator;
  const today = new Date();

  beforeEach(() => {
    // Cria uma nova instância do validador com as configurações padrão
    validator = new DateFnsBirthdateValidator();

    // Fixa a data atual para tornar os testes determinísticos
    jest.useFakeTimers();
    jest.setSystemTime(today);
  });

  afterEach(() => {
    // Restaura o comportamento normal do timer
    jest.useRealTimers();
  });

  describe("validate method", () => {
    it("deve aceitar uma data de nascimento válida dentro dos limites de idade", () => {
      // Arrange
      // Idade de 30 anos (dentro do intervalo 18-65)
      const validBirthdate = subYears(today, 30);

      // Act & Assert
      expect(() => validator.validate(validBirthdate)).not.toThrow();
    });

    it("deve aceitar uma data de nascimento no limite mínimo de idade (18 anos)", () => {
      // Arrange
      // Exatamente 18 anos atrás
      const minimumAgeBirthdate = subYears(today, 18);

      // Act & Assert
      expect(() => validator.validate(minimumAgeBirthdate)).not.toThrow();
    });

    it("deve aceitar uma data de nascimento no limite máximo de idade (65 anos)", () => {
      // Arrange
      // Exatamente 65 anos atrás
      const maximumAgeBirthdate = subYears(today, 65);

      // Act & Assert
      expect(() => validator.validate(maximumAgeBirthdate)).not.toThrow();
    });

    it("deve lançar InvalidParamError quando a data de nascimento é inválida", () => {
      // Arrange
      const invalidDates = [
        new Date("invalid-date"),
        null as unknown as Date,
        undefined as unknown as Date,
      ];
      const errorReason = "data inválida";

      // Act & Assert
      invalidDates.forEach((date) => {
        expect(() => validator.validate(date)).toThrow(InvalidParamError);
        expect(() => validator.validate(date)).toThrow(
          new InvalidParamError("data de nascimento", errorReason),
        );
      });
    });

    it("deve lançar InvalidParamError quando a data de nascimento está no futuro", () => {
      // Arrange
      // Um dia no futuro
      const futureBirthdate = addDays(today, 1);
      const errorReason = "não pode ser no futuro";

      // Act & Assert
      expect(() => validator.validate(futureBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(futureBirthdate)).toThrow(
        new InvalidParamError("data de nascimento", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a idade é menor que o mínimo permitido", () => {
      // Arrange
      // 17 anos (abaixo do mínimo de 18)
      const tooYoungBirthdate = subYears(today, 17);
      const errorReason = "usuário deve ter pelo menos 18 anos";

      // Act & Assert
      expect(() => validator.validate(tooYoungBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(tooYoungBirthdate)).toThrow(
        new InvalidParamError("data de nascimento", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a idade é maior que o máximo permitido", () => {
      // Arrange
      // 66 anos (acima do máximo de 65)
      const tooOldBirthdate = subYears(today, 66);
      const errorReason = "idade excede o limite máximo de 65 anos";

      // Act & Assert
      expect(() => validator.validate(tooOldBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(tooOldBirthdate)).toThrow(
        new InvalidParamError("data de nascimento", errorReason),
      );
    });
  });

  describe("configuração personalizada", () => {
    it("deve aceitar configurações personalizadas de idade mínima e máxima", () => {
      // Arrange
      const customValidator = new DateFnsBirthdateValidator({
        minAgeYears: 21,
        maxAgeYears: 50,
      });

      // Idade de 35 anos (dentro do intervalo personalizado 21-50)
      const validBirthdate = subYears(today, 35);

      // Idade de 20 anos (abaixo do mínimo personalizado de 21)
      const tooYoungBirthdate = subYears(today, 20);

      // Idade de 51 anos (acima do máximo personalizado de 50)
      const tooOldBirthdate = subYears(today, 51);

      // Act & Assert
      expect(() => customValidator.validate(validBirthdate)).not.toThrow();

      expect(() => customValidator.validate(tooYoungBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => customValidator.validate(tooYoungBirthdate)).toThrow(
        new InvalidParamError(
          "data de nascimento",
          "usuário deve ter pelo menos 21 anos",
        ),
      );

      expect(() => customValidator.validate(tooOldBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => customValidator.validate(tooOldBirthdate)).toThrow(
        new InvalidParamError(
          "data de nascimento",
          "idade excede o limite máximo de 50 anos",
        ),
      );
    });
  });

  describe("casos de borda", () => {
    it("deve lidar corretamente com datas próximas ao aniversário", () => {
      // Arrange
      // Cria uma data de nascimento exatamente 18 anos atrás, mas um dia a menos
      // (ou seja, o aniversário de 18 anos é amanhã)
      const almostMinimumAgeBirthdate = subYears(addDays(today, 1), 18);
      const errorReason = "usuário deve ter pelo menos 18 anos";

      // Act & Assert
      // Deve lançar erro porque a pessoa ainda não completou 18 anos
      expect(() => validator.validate(almostMinimumAgeBirthdate)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(almostMinimumAgeBirthdate)).toThrow(
        new InvalidParamError("data de nascimento", errorReason),
      );
    });
  });
});
