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
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { HttpRequest } from "@/backend/presentation/protocols";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { LoggerProviderMock } from "@/backend/__mocks__/logger.provider.mock";
import { UserCreateController } from "../user.create.controller";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";

interface SutResponses {
  sut: UserCreateController;
  userCreateService: UserCreateService;
  loggerMock: LoggerProviderMock;
}

const makeSut = (): SutResponses => {
  const hashProvider = new HashProviderMock();
  const loggerMock = new LoggerProviderMock();
  const sanitizer = new UserCreateDataSanitizer();
  const userBirthdateValidator = new UserBirthdateValidatorMock();
  const userEmailValidator = new UserEmailValidatorMock();
  const userPasswordValidator = new UserPasswordValidator();
  const userPhoneValidator = new UserPhoneValidatorMock();
  const repository = new InMemoryUserRepository();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(repository);
  const validator = new UserCreateValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });
  const userCreateService = new UserCreateService({
    repository,
    hashProvider,
    logger: loggerMock,
    sanitizer,
    validator,
  });
  const sut = new UserCreateController({
    userCreateService,
    logger: loggerMock,
  });

  return {
    sut,
    userCreateService,
    loggerMock,
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
  describe("Input validation", () => {
    it("should return badRequest if no body is provided", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      const createServiceSpy = jest.spyOn(userCreateService, "create");
      const request: HttpRequest = {};

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toBe("Dados não fornecidos");
      expect(createServiceSpy).not.toHaveBeenCalled();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "warn",
          message: "Requisição sem corpo ou com corpo vazio",
        }),
      );
    });

    it("should return badRequest if body is empty object", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      const createServiceSpy = jest.spyOn(userCreateService, "create");
      const request: HttpRequest<UserCreateData> = {
        body: {} as UserCreateData,
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toBe("Dados não fornecidos");
      expect(createServiceSpy).not.toHaveBeenCalled();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "warn",
          message: "Requisição sem corpo ou com corpo vazio",
        }),
      );
    });

    it("should return badRequest if data types are invalid", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      const createServiceSpy = jest.spyOn(userCreateService, "create");
      const request: HttpRequest<UserCreateData> = {
        body: {
          name: 123 as unknown as string,
          email: "valid@email.com",
          phone: "(62)99999-9999",
          birthdate: new Date(),
          password: "valid-password",
        } as unknown as UserCreateData,
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toBe("Dados com formato inválido");
      expect(createServiceSpy).not.toHaveBeenCalled();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "warn",
          message: "Dados com tipos inválidos",
        }),
      );
    });

    it("should return badRequest if birthdate is not a Date object", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      const createServiceSpy = jest.spyOn(userCreateService, "create");
      const request: HttpRequest<UserCreateData> = {
        body: {
          name: "Valid Name",
          email: "valid@email.com",
          phone: "(62)99999-9999",
          birthdate: "2000-01-01" as unknown as Date,
          password: "valid-password",
        } as UserCreateData,
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.errorMessage).toBe("Dados com formato inválido");
      expect(createServiceSpy).not.toHaveBeenCalled();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "warn",
          message: "Dados com tipos inválidos",
        }),
      );
    });
  });

  describe("Success case", () => {
    it("should call userCreateService with correct values", async () => {
      const { sut, userCreateService } = makeSut();
      const createServiceSpy = jest.spyOn(userCreateService, "create");
      const request: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      await sut.handle(request);

      expect(createServiceSpy).toHaveBeenCalledWith(makeValidUserData());
    });

    it("should return created on success", async () => {
      const { sut, loggerMock } = makeSut();
      const request: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "info",
          message: "Usuário criado com sucesso via controller",
        }),
      );
    });
  });

  describe("Error handling", () => {
    it("should return badRequest with correct message when MissingParamError is thrown", async () => {
      const { sut } = makeSut();

      const request: HttpRequest<UserCreateData> = {
        body: {
          email: "any-email@mail.com",
          phone: "(62)99999-9999",
          birthdate: new Date("2000-01-01"),
          password: "any-password",
        } as UserCreateData,
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(
        "Parâmetro obrigatório não informado: nome",
      );
      expect(response.body.metadata).toBeDefined();
    });

    it("should return badRequest with correct message when InvalidParamError is thrown", async () => {
      const { sut } = makeSut();
      const validUserData = makeValidUserData();
      const request: HttpRequest<UserCreateData> = {
        body: { ...validUserData, password: "less" },
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(
        "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
      );
      expect(response.body.metadata).toBeDefined();
    });

    it("should return conflict (409) with correct message when DuplicateResourceError is thrown", async () => {
      const { sut, userCreateService } = makeSut();

      await userCreateService.create(makeValidUserData());

      const request: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Email já cadastrado no sistema");
      expect(response.body.metadata).toBeDefined();
    });

    it("should return serverError when an unknown error is thrown", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      jest
        .spyOn(userCreateService, "create")
        .mockRejectedValueOnce(new Error("Erro desconhecido"));

      const request: HttpRequest<UserCreateData> = {
        body: makeValidUserData(),
      };

      const response = await sut.handle(request);

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Erro interno do servidor");
      expect(response.body.metadata).toBeDefined();
      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "error",
          message: "Erro no controller de criação de usuário",
        }),
      );
    });
  });

  describe("Logger behavior", () => {
    it("should log info when starting user creation", async () => {
      const { sut, loggerMock } = makeSut();
      const userData = makeValidUserData();
      const request: HttpRequest<UserCreateData> = { body: userData };

      await sut.handle(request);

      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "info",
          message: "Iniciando criação de usuário via controller",
          payload: expect.objectContaining({
            action: "user_create_controller_start",
            metadata: { email: userData.email },
          }),
        }),
      );
    });

    it("should log error when an exception occurs", async () => {
      const { sut, userCreateService, loggerMock } = makeSut();
      const error = new Error("Test error");
      jest.spyOn(userCreateService, "create").mockRejectedValueOnce(error);

      const userData = makeValidUserData();
      const request: HttpRequest<UserCreateData> = { body: userData };

      await sut.handle(request);

      expect(loggerMock.logs).toContainEqual(
        expect.objectContaining({
          level: "error",
          message: "Erro no controller de criação de usuário",
          payload: expect.objectContaining({
            action: "user_create_controller_error",
            error,
          }),
        }),
      );
    });
  });
});
