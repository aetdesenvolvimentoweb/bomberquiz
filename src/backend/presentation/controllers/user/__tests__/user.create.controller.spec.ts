/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { LoggerProviderMock } from "@/backend/__mocks__/logger.provider.mock";
import { UserCreateController } from "../user.create.controller";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateUseCase } from "@/backend/domain/usecases";
// Mock para o RequestValidator

class RequestValidatorMock<T = any> {
  validate(input: T): void {
    // Validação básica para campos obrigatórios
    if (!input) {
      throw new MissingParamError("Dados não fornecidos");
    }

    // Verifica se o objeto está vazio
    if (Object.keys(input as object).length === 0) {
      throw new MissingParamError("Dados não fornecidos");
    }
  }
}

// Mock para o UserCreateService
class UserCreateServiceMock implements UserCreateUseCase {
  private shouldThrowError: Error | null = null;

  setShouldThrowError(error: Error | null): void {
    this.shouldThrowError = error;
  }

  async create(data: UserCreateData): Promise<void> {
    if (this.shouldThrowError) {
      throw this.shouldThrowError;
    }

    // Validações simples para simular comportamento do serviço
    if (!data.name) {
      throw new MissingParamError("nome");
    }

    if (data.password && data.password.length < 8) {
      throw new InvalidParamError("senha deve ter no mínimo 8 caracteres");
    }

    return Promise.resolve();
  }
}

interface SutResponses {
  sut: UserCreateController;
  userCreateService: UserCreateServiceMock;
  userCreateRequestValidator: RequestValidatorMock<UserCreateData>;
  logger: LoggerProviderMock;
}

const makeSut = (): SutResponses => {
  // Cria mocks para todas as dependências
  const userCreateService = new UserCreateServiceMock();
  const userCreateRequestValidator = new RequestValidatorMock<UserCreateData>();
  const logger = new LoggerProviderMock();

  // Inicializa o controller com os mocks
  const sut = new UserCreateController({
    userCreateService,
    userCreateRequestValidator,
    logger,
  });

  return {
    sut,
    userCreateService,
    userCreateRequestValidator,
    logger,
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
        const { sut, userCreateService } = makeSut();
        const validData = makeValidUserData();
        const invalidData = omitField(field, validData);

        // Configurar o mock do serviço para lançar o erro esperado
        jest
          .spyOn(userCreateService, "create")
          .mockRejectedValueOnce(new MissingParamError(label));

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
        const { userCreateService, sut } = makeSut();
        const validData = makeValidUserData();
        validData.email = email;

        if (shouldThrow) {
          // Configurar o mock do serviço para lançar o erro esperado
          jest
            .spyOn(userCreateService, "create")
            .mockRejectedValueOnce(new InvalidParamError("email"));

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
        const { sut, userCreateService } = makeSut();
        const validData = makeValidUserData();

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          // Configurar o mock do serviço para lançar o erro de email duplicado
          jest
            .spyOn(userCreateService, "create")
            .mockRejectedValueOnce(new DuplicateResourceError("Email"));

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
        const { userCreateService, sut } = makeSut();
        const validData = makeValidUserData();
        validData.phone = phone;

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          jest
            .spyOn(userCreateService, "create")
            .mockRejectedValueOnce(new InvalidParamError("telefone"));

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
        const { userCreateService, sut } = makeSut();
        const validData = makeValidUserData();
        validData.birthdate = birthdate;

        const httpRequest: HttpRequest<UserCreateData> = {
          body: validData,
        };

        if (shouldThrow) {
          jest
            .spyOn(userCreateService, "create")
            .mockRejectedValueOnce(new InvalidParamError("data de nascimento"));

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

  describe("Handle server errors", () => {
    test("should return 500 if an unexpected error occurs", async () => {
      const { sut, userCreateRequestValidator } = makeSut();
      const validData = makeValidUserData();

      // Simulate an unexpected error (not an ApplicationError)
      jest
        .spyOn(userCreateRequestValidator, "validate")
        .mockImplementationOnce(() => {
          throw new Error("Unexpected error");
        });

      const httpRequest: HttpRequest<UserCreateData> = {
        body: validData,
      };

      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe("Erro interno do servidor");
    });
  });

  describe("Handle null or undefined request body", () => {
    test("should throw a MissingParamError if request body is null", async () => {
      const { sut } = makeSut();

      const httpRequest: HttpRequest<UserCreateData> = {
        body: {} as UserCreateData,
      };

      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      expect(httpResponse.body.errorMessage).toEqual(
        "Parâmetro obrigatório não informado: Dados não fornecidos",
      );
    });

    test("should throw a MissingParamError if request body is undefined", async () => {
      const { sut } = makeSut();

      const httpRequest: HttpRequest<UserCreateData> = {
        body: undefined,
      };

      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      expect(httpResponse.body.errorMessage).toEqual(
        "Parâmetro obrigatório não informado: Dados não fornecidos",
      );
    });
  });

  describe("Successful user creation", () => {
    test("should return 201 on successful user creation", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();

      const httpRequest: HttpRequest<UserCreateData> = {
        body: validData,
      };

      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
    });

    test("should call userCreateService.create with correct values", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();

      // Get access to the userCreateService
      const userCreateService = (sut as any).props.userCreateService;

      // Spy on the create method
      const createSpy = jest.spyOn(userCreateService, "create");

      const httpRequest: HttpRequest<UserCreateData> = {
        body: validData,
      };

      await sut.handle(httpRequest);

      expect(createSpy).toHaveBeenCalledWith(validData);
    });
  });

  describe("Logging behavior", () => {
    test("should log start, success, and error events", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();

      // Get access to the logger
      const logger = (sut as any).props.logger;

      // Spy on the logger methods
      const infoSpy = jest.spyOn(logger, "info");
      const errorSpy = jest.spyOn(logger, "error");

      // Test successful case
      const httpRequest: HttpRequest<UserCreateData> = {
        body: validData,
      };

      await sut.handle(httpRequest);

      expect(infoSpy).toHaveBeenCalledWith(
        "Iniciando criação de usuário via controller",
        expect.any(Object),
      );

      expect(infoSpy).toHaveBeenCalledWith(
        "Usuário criado com sucesso via controller",
        expect.any(Object),
      );

      // Test error case
      const userCreateService = (sut as any).props.userCreateService;
      jest.spyOn(userCreateService, "create").mockImplementationOnce(() => {
        throw new Error("Service error");
      });

      await sut.handle(httpRequest);

      expect(errorSpy).toHaveBeenCalledWith(
        "Erro no controller de criação de usuário",
        expect.any(Object),
      );
    });
  });
});
