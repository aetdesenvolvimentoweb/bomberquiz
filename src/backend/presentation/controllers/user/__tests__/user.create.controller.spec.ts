import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";
import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import {
  UserCreateValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateController } from "../user.create.controller";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateRequestValidator } from "@/backend/presentation/validators";
import { UserCreateService } from "@/backend/data/services";

interface SutResponses {
  sut: Controller;
  userEmailValidator: UserEmailValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
  userBirthdateValidator: UserBirthdateValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const userRepository = new InMemoryUserRepository();
  const userCreateDataSanitizer = new UserCreateDataSanitizer();
  const hashProvider = new HashProviderMock();
  const loggerProvider = new ConsoleLoggerProvider();
  // inicializa o userCreateDataValidator com as dependências necessárias
  const userBirthdateValidator = new UserBirthdateValidatorMock();
  const userEmailValidator = new UserEmailValidatorMock();
  const userPasswordValidator = new UserPasswordValidator();
  const userPhoneValidator = new UserPhoneValidatorMock();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });
  // inicializa o userCreateService com as dependências necessárias
  const userCreateService = new UserCreateService({
    repository: userRepository,
    sanitizer: userCreateDataSanitizer,
    hashProvider,
    logger: loggerProvider,
    validator: userCreateDataValidator,
  });
  // inicializa o userCreateRequestvalidator com as dependências necessárias
  const userCreateRequestValidator = new UserCreateRequestValidator(
    loggerProvider,
  );
  const sut = new UserCreateController({
    userCreateService,
    userCreateRequestValidator,
    logger: loggerProvider,
  });

  return {
    sut,
    userEmailValidator,
    userPhoneValidator,
    userBirthdateValidator,
  };
};

const makeValidUserData = (): UserCreateData => ({
  name: "any-name",
  email: "any-email@mail.com",
  phone: "(62)99999-9999",
  birthdate: new Date("2000-01-01"),
  password: "any-password",
});

describe("UserCreateController", () => {
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

        const httpRequest: HttpRequest<UserCreateData> = {
          body: invalidData,
        };

        const httpResponse: HttpResponse = await sut.handle(httpRequest);

        expect(httpResponse.body.errorMessage).toEqual(
          new MissingParamError(label).message,
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
        errorMessage: "Parâmetro inválido: email",
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
              throw new InvalidParamError("email");
            });

          const httpRequest: HttpRequest<UserCreateData> = {
            body: validData,
          };

          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.errorMessage).toEqual(errorMessage);
        } else {
          const httpRequest: HttpRequest<UserCreateData> = {
            body: validData,
          };

          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.success).toBeTruthy();
        }
      },
    );
  });

  describe("Validate unique email", () => {
    // Casos de teste para validação de email duplicado
    const emailTestCases = [
      {
        scenario: "duplicated email",
        shouldThrow: true,
        errorMessage: "Email já cadastrado no sistema",
      },
      {
        scenario: "unique email",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(emailTestCases)(
      "should handle email with $scenario",
      async ({ shouldThrow, errorMessage }) => {
        const { sut } = makeSut();
        const validData = makeValidUserData();

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          await sut.handle(httpRequest);

          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.errorMessage).toEqual(errorMessage);
        } else {
          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.success).toBeTruthy();
        }
      },
    );
  });

  describe("Validate phone format", () => {
    // Casos de teste para validação de phone
    const phoneTestCases = [
      {
        scenario: "invalid phone",
        phone: "invalid-phone 3212211",
        shouldThrow: true,
        errorMessage: "Parâmetro inválido: telefone",
      },
      {
        scenario: "valid mobile phone",
        phone: "(62) 99999-9999",
        shouldThrow: false,
        errorMessage: "",
      },
      {
        scenario: "valid phone",
        phone: "(62) 9999-9999",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(phoneTestCases)(
      "should handle phone with $scenario",
      async ({ phone, shouldThrow, errorMessage }) => {
        const { userPhoneValidator, sut } = makeSut();
        const validData = makeValidUserData();
        validData.phone = phone;

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          jest
            .spyOn(userPhoneValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError("telefone");
            });

          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.errorMessage).toEqual(errorMessage);
        } else {
          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.success).toBeTruthy();
        }
      },
    );
  });

  describe("Validate birthdate format", () => {
    // Casos de teste para validação de data de nascimento
    const birthdateTestCases = [
      {
        scenario: "invalid date",
        birthdate: "invalid-date" as unknown as Date,
        shouldThrow: true,
        errorMessage: "Parâmetro inválido: data de nascimento",
      },
      {
        scenario: "birthdate less then 18 years old",
        birthdate: new Date(),
        shouldThrow: true,
        errorMessage: "Parâmetro inválido: data de nascimento",
      },
      {
        scenario: "valid birthdate",
        birthdate: new Date("2000-01-01"),
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(birthdateTestCases)(
      "should handle birthdate with $scenario",
      async ({ birthdate, shouldThrow, errorMessage }) => {
        const { userBirthdateValidator, sut } = makeSut();
        const validData = makeValidUserData();
        validData.birthdate = birthdate;

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          jest
            .spyOn(userBirthdateValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError("data de nascimento");
            });

          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.errorMessage).toEqual(errorMessage);
        } else {
          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.success).toBeTruthy();
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
        errorMessage:
          "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
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

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.errorMessage).toEqual(errorMessage);
        } else {
          const httpResponse: HttpResponse = await sut.handle(httpRequest);

          expect(httpResponse.body.success).toBeTruthy();
        }
      },
    );
  });
});
