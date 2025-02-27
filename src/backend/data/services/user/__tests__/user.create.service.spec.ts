import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import {
  UserCreateValidator,
  UserPasswordValidator,
} from "@/backend/data/validators";
import {
  UserCreateValidatorUseCase,
  UserEmailValidatorUseCase,
} from "@/backend/domain/validators";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateService } from "../user.create.service";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserEmailValidatorMock } from "@/backend/__mocks__/user";
import { UserRepository } from "@/backend/domain/repositories";

interface SutResponses {
  sut: UserCreateUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const repository: UserRepository = new InMemoryUserRepository();
  const sanitizer: UserCreateDataSanitizerUseCase =
    new UserCreateDataSanitizer();
  const userEmailValidator = new UserEmailValidatorMock();
  const userPasswordValidator = new UserPasswordValidator();
  const validator: UserCreateValidatorUseCase = new UserCreateValidator({
    userEmailValidator,
    userPasswordValidator,
  });
  const sut = new UserCreateService({
    repository,
    sanitizer,
    validator,
  });

  return { sut, userEmailValidator };
};

describe("UserCreateService", () => {
  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123456789",
    birthdate: new Date(),
    password: "password123",
  });

  it("should create a user", async () => {
    const { sut } = makeSut();
    const data = makeValidUserData();
    await expect(sut.create(data)).resolves.not.toThrow();
  });

  describe("Data sanitization", () => {
    it("should sanitize user data before validation", async () => {
      const { sut } = makeSut();
      const data = {
        name: "  John Doe  ",
        email: "  EMAIL@example.com  ",
        phone: "(11) 98765-4321",
        birthdate: new Date(),
        password: "  password123  ",
      } as UserCreateData;

      // O teste passa se não houver erros, indicando que os dados foram sanitizados corretamente
      await expect(sut.create(data)).resolves.not.toThrow();
    });
  });

  describe("Validate required fields", () => {
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

        await expect(sut.create(invalidData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );
  });

  describe("Validate email format", () => {
    // Casos de teste para validação de email
    const emailTestCases = [
      {
        scenario: "invalid email",
        email: "invalid-email",
        shouldThrow: true,
        errorMessage: "email inválido.",
      },
      {
        scenario: "valid email",
        email: "email@example.com",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(emailTestCases)(
      "should handle email with $scenario",
      async ({ email, shouldThrow, errorMessage }) => {
        const { userEmailValidator, sut } = makeSut();
        const validData = makeValidUserData();
        validData.email = email;

        if (shouldThrow) {
          jest
            .spyOn(userEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.create(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(validData)).resolves.not.toThrow();
        }
      },
    );
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
          await expect(sut.create(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(validData)).resolves.not.toThrow();
        }
      },
    );
  });
});
