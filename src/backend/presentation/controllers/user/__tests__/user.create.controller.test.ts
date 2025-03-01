/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import {
  UserCreateValidator,
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

interface SutResponses {
  controller: UserCreateController;
  repository: InMemoryUserRepository;
  userCreateService: UserCreateService;
}

describe("UserCreateController Integration", () => {
  const makeSut = (): SutResponses => {
    // Repositório em memória
    const repository = new InMemoryUserRepository();

    // Logger real
    const logger = new ConsoleLoggerProvider();

    // Sanitizador real
    const sanitizer = new UserCreateDataSanitizer();

    // Hash provider mock
    const hashProvider = new HashProviderMock();

    // Validadores
    const userBirthdateValidator = new UserBirthdateValidatorMock();
    const userEmailValidator = new UserEmailValidatorMock();
    const userPasswordValidator = new UserPasswordValidator();
    const userPhoneValidator = new UserPhoneValidatorMock();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(repository);

    // Validador composto
    const userCreateServiceValidator = new UserCreateValidator({
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    });

    // Serviço de criação de usuário
    const userCreateService = new UserCreateService({
      repository,
      hashProvider,
      logger,
      sanitizer,
      validator: userCreateServiceValidator,
    });

    const userCreateControllerValidator = new UserCreateRequestValidator(
      logger,
    );
    // Controller
    const controller = new UserCreateController({
      userCreateService,
      logger,
      userCreateRequestValidator: userCreateControllerValidator,
    });

    return {
      controller,
      repository,
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
      const { controller, repository } = makeSut();
      const userData = makeValidUserData();

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      const response = await controller.handle(request);

      // Verifica a resposta HTTP
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();

      // Verifica se o usuário foi persistido no repositório
      const createdUser = await repository.findByEmail(userData.email);
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe(userData.name);
      expect(createdUser?.email).toBe(userData.email);
      expect(createdUser?.phone).toBe("11999999999"); // Sanitizado
      expect(createdUser?.birthdate).toEqual(userData.birthdate);
      // A senha deve estar hasheada
      expect(createdUser?.password).not.toBe(userData.password);
    });

    it("should sanitize data before creating the user", async () => {
      const { controller, repository } = makeSut();

      const userData: UserCreateData = {
        name: "  John Doe  ", // Com espaços extras
        email: "JOHN.DOE@EXAMPLE.COM", // Em maiúsculas
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      await controller.handle(request);

      // Verifica se os dados sanitizados foram salvos no repositório
      const createdUser = await repository.findByEmail("john.doe@example.com");
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
        request: {},
        expectedStatus: 400,
        expectedMessage:
          "Parâmetro obrigatório não informado: Dados não fornecidos",
      },
      {
        scenario: "empty body object",
        request: { body: {} as UserCreateData },
        expectedStatus: 400,
        expectedMessage:
          "Parâmetro obrigatório não informado: Dados não fornecidos",
      },
      {
        scenario: "invalid data types",
        request: {
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
      async ({ request, expectedStatus, expectedMessage }) => {
        const { controller } = makeSut();

        const response = await controller.handle(request);

        expect(response.statusCode).toBe(expectedStatus);
        expect(response.body.success).toBe(false);
        expect(response.body.errorMessage).toBe(expectedMessage);
      },
    );
  });

  describe("Domain error handling", () => {
    it("should return 400 when a required field is missing", async () => {
      const { controller } = makeSut();

      const userData = { ...makeValidUserData() };
      delete (userData as any).name;

      const request: HttpRequest<UserCreateData> = {
        body: userData as UserCreateData,
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(
        "Parâmetro obrigatório não informado: nome",
      );
    });

    it("should return 400 when password is too short", async () => {
      const { controller } = makeSut();

      const userData = makeValidUserData();
      userData.password = "123"; // Senha muito curta

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(
        "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
      );
    });

    it("should return 400 when email format is invalid", async () => {
      const { controller, userCreateService } = makeSut();

      // Forçar erro de validação de email no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new InvalidParamError("email"));

      const userData = makeValidUserData();
      userData.email = "invalid-email"; // Email inválido

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Parâmetro inválido: email");
    });

    it("should return 400 when phone format is invalid", async () => {
      const { controller, userCreateService } = makeSut();

      // Forçar erro de validação de telefone no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new InvalidParamError("telefone"));

      const userData = makeValidUserData();
      userData.phone = "invalid-phone"; // Telefone inválido

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Parâmetro inválido: telefone");
    });

    it("should return 409 when email is already registered", async () => {
      const { controller, repository } = makeSut();
      const userData = makeValidUserData();

      // Criar um usuário com o mesmo email
      await repository.create(userData);

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Email já cadastrado no sistema");
    });
  });

  describe("Unexpected error handling", () => {
    it("should return 500 when an unexpected error occurs", async () => {
      const { controller, userCreateService } = makeSut();

      // Forçar um erro no serviço
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new Error("Erro inesperado"));

      const request: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Erro interno do servidor");
    });
  });

  describe("Logging behavior", () => {
    it("should log start, success, and error events", async () => {
      const { controller, userCreateService } = makeSut();
      const userData = makeValidUserData();

      // Acessar o logger
      const logger = (controller as any).props.logger;

      // Espionar os métodos do logger
      const infoSpy = jest.spyOn(logger, "info");
      const errorSpy = jest.spyOn(logger, "error");

      // Testar caso de sucesso
      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      await controller.handle(request);

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

      await controller.handle(request);

      expect(errorSpy).toHaveBeenCalledWith(
        "Erro no controller de criação de usuário",
        expect.any(Object),
      );
    });

    it("should include email in log metadata", async () => {
      const { controller } = makeSut();
      const userData = makeValidUserData();

      // Acessar o logger
      const logger = (controller as any).props.logger;

      // Espionar os métodos do logger
      const infoSpy = jest.spyOn(logger, "info");

      const request: HttpRequest<UserCreateData> = {
        body: userData,
      };

      await controller.handle(request);

      // Verificar se o email está nos metadados do log
      expect(infoSpy).toHaveBeenCalledWith(
        "Iniciando criação de usuário via controller",
        expect.objectContaining({
          metadata: expect.objectContaining({
            email: userData.email,
          }),
        }),
      );
    });
  });
});
