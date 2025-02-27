import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateValidator } from "@/backend/data/validators/user/user.create.validator";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";
import { UserPasswordValidator } from "../user.password.validator";

interface SutResponses {
  sut: UserCreateValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const sut = new UserCreateValidator({
    userPasswordValidator: new UserPasswordValidator(),
  });

  return {
    sut,
  };
};

describe("UserCreateValidator", () => {
  const makeValidUserData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "any_phone",
    birthdate: new Date(),
    password: "any_password",
  });

  describe("validate required fields", () => {
    // Mapa de campos para labels
    const fieldToLabelMap: Record<string, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Função genérica para omitir um campo
    const omitField = (field: string, data: UserCreateData) => {
      return Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== field),
      ) as UserCreateData;
    };

    // Cria os casos de teste a partir do mapa
    const testCases = Object.entries(fieldToLabelMap).map(([field, label]) => ({
      field,
      label,
    }));

    test.each(testCases)(
      "should throw a MissingParamError if $field is not provided",
      async ({ field, label }) => {
        const { sut } = makeSut();
        const validData = makeValidUserData();
        const invalidData = omitField(field, validData);

        await expect(sut.validate(invalidData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );

    it("should not throw if all required fields are provided", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();

      await expect(sut.validate(validData)).resolves.not.toThrow();
    });
  });

  describe("Validate password format", () => {
    // Casos de teste para validação de senha
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
      async ({ password, shouldThrow, errorMessage }) => {
        const { sut } = makeSut();
        const validData = makeValidUserData();
        validData.password = password;

        if (shouldThrow) {
          await expect(sut.validate(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });
});
