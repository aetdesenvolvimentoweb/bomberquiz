import { UserPasswordValidator } from "@/backend/data/validators";
import { InvalidParamError } from "@/backend/domain/errors";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";

interface SutResponses {
  sut: UserPasswordValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const sut = new UserPasswordValidator();

  return { sut };
};

describe("UserPasswordValidator", () => {
  let sut: UserPasswordValidatorUseCase;

  describe("validate", () => {
    beforeEach(() => {
      const sutInstance = makeSut();
      sut = sutInstance.sut;
    });

    // Casos de teste para validação de senha
    const passwordTestCases = [
      {
        scenario: "less than 8 characters",
        password: "1234567",
        shouldThrow: true,
        errorMessage: "senha deve ter no mínimo 8 caracteres",
      },
      {
        scenario: "without uppercase letter",
        password: "1234567a",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra maiúscula",
      },
      {
        scenario: "without lowercase letter",
        password: "1234567B",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra minúscula",
      },
      {
        scenario: "without number",
        password: "ABCDEFab",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos um número",
      },
      {
        scenario: "without special character",
        password: "ABC123abc",
        shouldThrow: true,
        errorMessage:
          "senha deve ter pelo menos um caractere especial (@, #, $, %, etc.)",
      },
      {
        scenario: "exactly 8 characters",
        password: "AB12ab%*",
        shouldThrow: false,
        errorMessage: "",
      },
      {
        scenario: "more than 8 characters",
        password: "ABC123abc@",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(passwordTestCases)(
      "should handle password with $scenario",
      ({ password, shouldThrow, errorMessage }) => {
        if (shouldThrow) {
          expect(() => sut.validate(password)).toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          expect(() => sut.validate(password)).not.toThrow();
        }
      },
    );
  });

  describe("complex password scenarios", () => {
    beforeEach(() => {
      const sutInstance = makeSut();
      sut = sutInstance.sut;
    });

    const complexPasswordCases = [
      {
        scenario: "with Unicode special characters",
        password: "Pass1234★☺♛",
        shouldThrow: false,
      },
      {
        scenario: "with multiple spaces",
        password: "Pass 1234 @#$",
        shouldThrow: false,
      },
      {
        scenario: "extremely long password",
        password: "A".repeat(50) + "b1@",
        shouldThrow: false,
      },
      {
        scenario: "with emojis",
        password: "Pass1234😀👍",
        shouldThrow: false,
      },
      {
        scenario: "with newlines and tabs",
        password: "Pass1234\n\t@",
        shouldThrow: false,
      },
    ];

    test.each(complexPasswordCases)(
      "should handle password $scenario",
      ({ password, shouldThrow }) => {
        if (shouldThrow) {
          expect(() => sut.validate(password)).toThrow(InvalidParamError);
        } else {
          expect(() => sut.validate(password)).not.toThrow();
        }
      },
    );
  });
});
