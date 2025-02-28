import { InvalidParamError } from "@/backend/domain/errors";
import { UserPasswordValidator } from "../user.password.validator";
import { UserPasswordValidatorUseCase } from "@/backend/domain/validators";

interface SutResponses {
  sut: UserPasswordValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const sut = new UserPasswordValidator();
  return { sut };
};

describe("UserPasswordValidator", () => {
  describe("validate", () => {
    describe("password length validation", () => {
      const passwordTestCases = [
        {
          scenario: "less than 8 characters",
          password: "1234567",
          shouldThrow: true,
          errorMessage: "senha deve ter no mínimo 8 caracteres.",
        },
        {
          scenario: "exactly 8 characters",
          password: "12345678",
          shouldThrow: false,
          errorMessage: "",
        },
        {
          scenario: "more than 8 characters",
          password: "123456789",
          shouldThrow: false,
          errorMessage: "",
        },
      ];

      test.each(passwordTestCases)(
        "should handle password with $scenario",
        ({ password, shouldThrow, errorMessage }) => {
          const { sut } = makeSut();

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
  });
});
