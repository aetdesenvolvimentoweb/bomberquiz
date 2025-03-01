/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import {
  UserCreateDataValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { HttpRequest } from "@/backend/presentation/protocols";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { InvalidParamError } from "@/backend/domain/errors";
import { UserCreateController } from "../user.create.controller";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateRequestValidator } from "@/backend/presentation/validators";
import { UserCreateService } from "@/backend/data/services";
import { UserRepository } from "@/backend/domain/repositories";

interface SutResponses {
  userCreateController: UserCreateController;
  userRepository: UserRepository;
  userCreateService: UserCreateService;
}

describe("UserCreateController Integration", () => {
  const makeSut = (): SutResponses => {
    // Repositório em memória
    const userRepository = new InMemoryUserRepository();

    // Logger real
    const loggerProvider = new ConsoleLoggerProvider();

    // Sanitizador real
    const userCreateDataSanitizer = new UserCreateDataSanitizer();

    // Hash provider mock
    const hashProvider = new HashProviderMock();

    // Validadores
    const userBirthdateValidator = new UserBirthdateValidatorMock();
    const userEmailValidator = new UserEmailValidatorMock();
    const userPasswordValidator = new UserPasswordValidator();
    const userPhoneValidator = new UserPhoneValidatorMock();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(
      userRepository,
    );

    // Validador composto
    const userCreateDataValidator = new UserCreateDataValidator({
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    });

    // Serviço de criação de usuário
    const userCreateService = new UserCreateService({
      userRepository,
      hashProvider,
      loggerProvider,
      userCreateDataSanitizer,
      userCreateDataValidator: userCreateDataValidator,
    });

    const userCreateRequestValidator = new UserCreateRequestValidator(
      loggerProvider,
    );
    // Controller
    const userCreateController = new UserCreateController({
      userCreateService,
      loggerProvider,
      userCreateRequestValidator,
    });

    return {
      userCreateController,
      userRepository,
      userCreateService,
    };
  };

  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(11) 99999-9999",
    birthdate: new Date("1990-01-01"),
    password: "Password123!",
  });

  describe("Success flow", () => {
    it("should create a user and return 201 when request is valid", async () => {
      const { userCreateController, userRepository } = makeSut();
      const userCreateData = makeValidUserData();

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      // Verifica a resposta HTTP
      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();

      // Verifica se o usuário foi persistido no repositório
      const createdUser = await userRepository.findByEmail(
        userCreateData.email,
      );
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe(userCreateData.name);
      expect(createdUser?.email).toBe(userCreateData.email);
      expect(createdUser?.phone).toBe("11999999999"); // Sanitizado
      expect(createdUser?.birthdate).toEqual(userCreateData.birthdate);
      // A senha deve estar hasheada
      expect(createdUser?.password).not.toBe(userCreateData.password);
    });

    it("should sanitize data before creating the user", async () => {
      const { userCreateController, userRepository } = makeSut();

      const userCreateData: UserCreateData = {
        name: "  John Doe  ", // Com espaços extras
        email: "JOHN.DOE@EXAMPLE.COM", // Em maiúsculas
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      await userCreateController.handle(httpRequest);

      // Verifica se os dados sanitizados foram salvos no repositório
      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("John Doe"); // Sem espaços extras
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas
      expect(createdUser?.phone).toBe("11999999999"); // Sanitizado
    });
  });

  describe("Input validation", () => {
    // Usando test.each para casos de validação de entrada
    const inputValidationCases = [
      {
        scenario: "no body provided",
        httpRequest: {},
        expectedStatus: 400,
        expectedMessage:
          "Parâmetro obrigatório não informado: Dados não fornecidos",
      },
      {
        scenario: "empty body object",
        httpRequest: { body: {} as UserCreateData },
        expectedStatus: 400,
        expectedMessage:
          "Parâmetro obrigatório não informado: Dados não fornecidos",
      },
      {
        scenario: "invalid data types",
        httpRequest: {
          body: {
            name: 123 as unknown as string,
            email: "valid@email.com",
            phone: "(11) 99999-9999",
            birthdate: new Date(),
            password: "valid-password",
          } as unknown as UserCreateData,
        },
        expectedStatus: 400,
        expectedMessage: new InvalidParamError("nome").message,
      },
    ];

    test.each(inputValidationCases)(
      "should return $expectedStatus when $scenario",
      async ({ httpRequest, expectedStatus, expectedMessage }) => {
        const { userCreateController } = makeSut();

        const httpResponse = await userCreateController.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(expectedStatus);
        expect(httpResponse.body.success).toBe(false);
        expect(httpResponse.body.errorMessage).toBe(expectedMessage);
      },
    );
  });

  describe("Domain error handling", () => {
    it("should return 400 when a required field is missing", async () => {
      const { userCreateController } = makeSut();

      const userCreateData = { ...makeValidUserData() };
      delete (userCreateData as any).name;

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData as UserCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Parâmetro obrigatório não informado: nome",
      );
    });

    it("should return 400 when password is too short", async () => {
      const { userCreateController } = makeSut();

      const userCreateData = makeValidUserData();
      userCreateData.password = "123"; // Senha muito curta

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
      );
    });

    it("should return 400 when email format is invalid", async () => {
      const { userCreateController, userCreateService } = makeSut();

      // Forçar erro de validação de email no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new InvalidParamError("email"));

      const userCreateData = makeValidUserData();
      userCreateData.email = "invalid-email"; // Email inválido

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe("Parâmetro inválido: email");
    });

    it("should return 400 when phone format is invalid", async () => {
      const { userCreateController, userCreateService } = makeSut();

      // Forçar erro de validação de telefone no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new InvalidParamError("telefone"));

      const userCreateData = makeValidUserData();
      userCreateData.phone = "invalid-phone"; // Telefone inválido

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Parâmetro inválido: telefone",
      );
    });

    it("should return 409 when email is already registered", async () => {
      const { userCreateController, userRepository } = makeSut();
      const userCreateData = makeValidUserData();

      // Criar um usuário com o mesmo email
      await userRepository.create(userCreateData);

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(409);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Email já cadastrado no sistema",
      );
    });
  });

  describe("Unexpected error handling", () => {
    it("should return 500 when an unexpected error occurs", async () => {
      const { userCreateController, userCreateService } = makeSut();

      // Forçar um erro no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new Error("Erro inesperado"));

      const httpRequest: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      const httpResponse = await userCreateController.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe("Erro interno do servidor");
    });
  });

  describe("Logging behavior", () => {
    it("should log start, success, and error events", async () => {
      const { userCreateController, userCreateService } = makeSut();
      const userCreateData = makeValidUserData();

      // Acessar o loggerProvider
      const loggerProvider = (userCreateController as any).props.loggerProvider;

      // Espionar os métodos do loggerProvider
      const infoSpy = jest.spyOn(loggerProvider, "info");
      const errorSpy = jest.spyOn(loggerProvider, "error");

      // Testar caso de sucesso
      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      await userCreateController.handle(httpRequest);

      expect(infoSpy).toHaveBeenCalledWith(
        "Iniciando criação de usuário via controller",
        expect.any(Object),
      );

      expect(infoSpy).toHaveBeenCalledWith(
        "Usuário criado com sucesso via controller",
        expect.any(Object),
      );

      // Testar caso de erro
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new Error("Erro de serviço"));

      await userCreateController.handle(httpRequest);

      expect(errorSpy).toHaveBeenCalledWith(
        "Erro no controller de criação de usuário",
        expect.any(Object),
      );
    });

    it("should include email in log metadata", async () => {
      const { userCreateController } = makeSut();
      const userCreateData = makeValidUserData();

      // Acessar o loggerProvider
      const loggerProvider = (userCreateController as any).props.loggerProvider;

      // Espionar os métodos do loggerProvider
      const infoSpy = jest.spyOn(loggerProvider, "info");

      const httpRequest: HttpRequest<UserCreateData> = {
        body: userCreateData,
      };

      await userCreateController.handle(httpRequest);

      // Verificar se o email está nos metadados do log
      expect(infoSpy).toHaveBeenCalledWith(
        "Iniciando criação de usuário via controller",
        expect.objectContaining({
          metadata: expect.objectContaining({
            email: userCreateData.email,
          }),
        }),
      );
    });
  });
});
