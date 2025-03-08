import { UserCreateService } from "@/backend/data/services";
import { UserCreateDataValidator } from "@/backend/data/validators";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
  ServerError,
} from "@/backend/domain/errors";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";

import { UserCreateController } from "../user.create.controller";

interface SutResponses {
  sut: Controller<UserCreateData>;
  userCreateService: UserCreateService;
  userCreateDataValidator: UserCreateDataValidator;
  loggerProvider: LoggerProvider;
}

const makeSut = (): SutResponses => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const loggerProvider = jest.mocked<LoggerProvider>({
    log: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  });
  const userCreateDataSanitizer = jest.mocked<UserCreateDataSanitizerUseCase>({
    sanitize: jest.fn(),
  });
  const userBirthdateValidator = jest.mocked({
    validate: jest.fn(),
  });
  const userEmailValidator = jest.mocked({
    validate: jest.fn(),
  });
  const userPasswordValidator = jest.mocked({
    validate: jest.fn(),
  });
  const userPhoneValidator = jest.mocked({
    validate: jest.fn(),
  });
  const userUniqueEmailValidator = jest.mocked({
    validate: jest.fn(),
  });
  const userCreateDataValidator = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });
  const userCreateService = new UserCreateService({
    userRepository,
    loggerProvider,
    userCreateDataSanitizer,
    userCreateDataValidator,
  });
  const sut = new UserCreateController({
    userCreateService,
    loggerProvider,
  });
  return {
    sut,
    userCreateService,
    userCreateDataValidator,
    loggerProvider,
  };
};

describe("UserCreateController", () => {
  const makeHttpRequest = (): HttpRequest<UserCreateData> => ({
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      phone: "(99) 99999-9999",
      birthdate: new Date("2007-01-01T00:00:00.000Z"),
      password: "P@ssw0rd",
    },
  });

  let sut: Controller<UserCreateData>;
  let userCreateService: UserCreateService;
  let userCreateDataValidator: UserCreateDataValidator;
  let loggerProvider: LoggerProvider;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userCreateService = sutInstance.userCreateService;
    userCreateDataValidator = sutInstance.userCreateDataValidator;
    loggerProvider = sutInstance.loggerProvider;
  });

  describe("logger", () => {
    it("should log user creation start", async () => {
      const httpRequest = makeHttpRequest();
      const loggerSpy = jest.spyOn(loggerProvider, "info");

      await sut.handle(httpRequest);

      expect(loggerSpy).toHaveBeenCalledWith("Iniciando a criação de usuário", {
        action: "user.create.service.start",
        metadata: { email: httpRequest.body?.email },
      });
    });

    it("should log request validated", async () => {
      const httpRequest = makeHttpRequest();
      const loggerSpy = jest.spyOn(loggerProvider, "info");

      await sut.handle(httpRequest);

      expect(loggerSpy).toHaveBeenCalledWith(
        "Requisição validada com sucesso",
        {
          action: "request.body.validated",
        },
      );
    });

    it("should log user creation success", async () => {
      const httpRequest = makeHttpRequest();
      jest.spyOn(userCreateService, "create").mockImplementationOnce(() => {
        return Promise.resolve();
      });
      const loggerSpy = jest.spyOn(loggerProvider, "info");

      await sut.handle(httpRequest);

      expect(loggerSpy).toHaveBeenCalledWith("Usuário criado com sucesso", {
        action: "user.created.controller",
      });
    });

    it("should log user creation error", async () => {
      const httpRequest = makeHttpRequest();
      jest.spyOn(userCreateService, "create").mockImplementationOnce(() => {
        throw new Error();
      });
      const loggerSpy = jest.spyOn(loggerProvider, "error");

      const httpResponse: HttpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(500);

      expect(loggerSpy).toHaveBeenCalledWith("Erro ao criar usuário", {
        action: "user.creation.failed.controller",
        metadata: { email: httpRequest.body?.email },
        error: new Error(),
      });
    });
  });

  describe("success", () => {
    it("should call UserCreateService with correct values", async () => {
      const httpRequest = makeHttpRequest();
      const createSpy = jest.spyOn(userCreateService, "create");

      await sut.handle(httpRequest);
      expect(createSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it("should return 201 when user is created", async () => {
      const httpRequest = makeHttpRequest();
      jest.spyOn(userCreateService, "create").mockResolvedValueOnce();

      const httpResponse: HttpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
    });
  });

  describe("client errors", () => {
    describe("body is undefined or null", () => {
      it("should return 400 when body is undefined", async () => {
        const httpRequest = makeHttpRequest();
        httpRequest.body = undefined;

        const httpResponse: HttpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.errorMessage).toEqual(
          new MissingParamError("corpo da requisição não informado").message,
        );
      });

      it("should return 400 when body is null", async () => {
        const httpRequest = makeHttpRequest();
        httpRequest.body = null as unknown as UserCreateData;

        const httpResponse: HttpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.errorMessage).toEqual(
          new MissingParamError("corpo da requisição não informado").message,
        );
      });
    });

    describe("missing params", () => {
      // Campos obrigatórios
      const requiredFields: { field: keyof UserCreateData; label: string }[] = [
        { field: "name", label: "nome" },
        { field: "email", label: "email" },
        { field: "phone", label: "telefone" },
        { field: "birthdate", label: "data de nascimento" },
        { field: "password", label: "senha" },
      ];

      // Função genérica para omitir um campo
      const omitField = (
        field: string,
        httpRequest: HttpRequest<UserCreateData>,
      ): HttpRequest<UserCreateData> => {
        if (!httpRequest.body) {
          return httpRequest;
        }

        const filteredBody = Object.fromEntries(
          Object.entries(httpRequest.body).filter(([key]) => key !== field),
        ) as UserCreateData;

        return {
          ...httpRequest,
          body: filteredBody,
        };
      };

      test.each(requiredFields)(
        "should throw a MissingParamError if $field is not provided",
        async ({ field, label }) => {
          const httpRequest = makeHttpRequest();
          const missingData = omitField(field, httpRequest);
          jest
            .spyOn(userCreateDataValidator, "validate")
            .mockImplementationOnce(() => {
              throw new MissingParamError(label);
            });

          const httpResponse = await sut.handle(missingData);

          expect(httpResponse.statusCode).toBe(400);
          expect(httpResponse.body.errorMessage).toEqual(
            new MissingParamError(label).message,
          );
        },
      );
    });

    describe("invalid params", () => {
      it("should return 400 if an invalid email is provided", async () => {
        const httpRequest = makeHttpRequest();
        httpRequest.body!.email = "invalid-email";
        jest
          .spyOn(userCreateDataValidator, "validate")
          .mockImplementationOnce(() => {
            throw new InvalidParamError("email");
          });

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.errorMessage).toEqual(
          new InvalidParamError("email").message,
        );
      });

      it("should return 409 if an duplicated email is provided", async () => {
        const httpRequest = makeHttpRequest();
        jest
          .spyOn(userCreateDataValidator, "validate")
          .mockImplementationOnce(() => {
            throw new DuplicateResourceError("Email");
          });

        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(409);
        expect(httpResponse.body.errorMessage).toEqual(
          new DuplicateResourceError("Email").message,
        );
      });
    });

    it("should return 400 if an invalid phone is provided", async () => {
      const httpRequest = makeHttpRequest();
      httpRequest.body!.phone = "invalid-phone";
      jest
        .spyOn(userCreateDataValidator, "validate")
        .mockImplementationOnce(() => {
          throw new InvalidParamError("telefone");
        });

      const httpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.errorMessage).toEqual(
        new InvalidParamError("telefone").message,
      );
    });

    it("should return 400 if an invalid birthdate is provided", async () => {
      const httpRequest = makeHttpRequest();
      httpRequest.body!.birthdate = new Date();
      jest
        .spyOn(userCreateDataValidator, "validate")
        .mockImplementationOnce(() => {
          throw new InvalidParamError("data de nascimento");
        });

      const httpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.errorMessage).toEqual(
        new InvalidParamError("data de nascimento").message,
      );
    });

    it("should return 400 if an invalid password is provided", async () => {
      const httpRequest = makeHttpRequest();
      httpRequest.body!.password = "invalid-password";
      jest
        .spyOn(userCreateDataValidator, "validate")
        .mockImplementationOnce(() => {
          throw new InvalidParamError(
            "senha deve ter pelo menos uma letra maiúscula",
          );
        });

      const httpResponse = await sut.handle(httpRequest);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.errorMessage).toEqual(
        new InvalidParamError("senha deve ter pelo menos uma letra maiúscula")
          .message,
      );
    });
  });

  describe("server errors", () => {
    it("should return 500 if an unexpected error occurs", async () => {
      const httpRequest = makeHttpRequest();
      const error = new Error("Unexpected error");

      jest.spyOn(userCreateService, "create").mockImplementationOnce(() => {
        throw new ServerError(error);
      });
      const httpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.errorMessage).toEqual(
        new ServerError(error).message,
      );
    });
  });
});
