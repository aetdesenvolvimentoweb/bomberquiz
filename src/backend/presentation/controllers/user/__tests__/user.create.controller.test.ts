/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import { ConsoleLoggerProvider } from "@/backend/infra/providers/console.logger.provider";
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { HttpRequest } from "@/backend/presentation/protocols";
import { InMemoryUserRepository } from "@/backend/infra/repositories/inmemory.user.repository";
import { InvalidParamError } from "@/backend/domain/errors";
import { UserCreateController } from "../user.create.controller";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers/user/user.create.data.sanitizer";
import { UserCreateRequestValidator } from "@/backend/presentation/validators";
import { UserCreateService } from "@/backend/data/services/user/user.create.service";
import { UserCreateValidator } from "@/backend/data/validators/user/user.create.validator";
import { UserPasswordValidator } from "@/backend/data/validators/user/user.password.validator";
import { UserUniqueEmailValidator } from "@/backend/data/validators/user/user.unique.email.validator";

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
});
