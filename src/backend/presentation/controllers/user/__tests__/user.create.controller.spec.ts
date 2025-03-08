import { UserCreateService } from "@/backend/data/services";
import { UserCreateDataValidator } from "@/backend/data/validators";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
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
  });
  return {
    sut,
    userCreateService,
    userCreateDataValidator,
  };
};

describe("UserCreateController", () => {
  const httpRequest: HttpRequest<UserCreateData> = {
    body: {
      name: "any_name",
      email: "any_email@mail.com",
      phone: "(99) 99999-9999",
      birthdate: new Date("2007-01-01T00:00:00.000Z"),
      password: "P@ssw0rd",
    },
  };

  let sut: Controller<UserCreateData>;
  let userCreateService: UserCreateService;
  let userCreateDataValidator: UserCreateDataValidator;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userCreateService = sutInstance.userCreateService;
    userCreateDataValidator = sutInstance.userCreateDataValidator;
  });

  describe("success", () => {
    it("should call UserCreateService with correct values", async () => {
      const createSpy = jest.spyOn(userCreateService, "create");

      await sut.handle(httpRequest);
      expect(createSpy).toHaveBeenCalledWith(httpRequest.body);
    });

    it("should return 201 when user is created", async () => {
      jest.spyOn(userCreateService, "create").mockResolvedValueOnce();

      const httpResponse: HttpResponse = await sut.handle(httpRequest);
      expect(httpResponse.statusCode).toBe(201);
    });
  });

  describe("client errors", () => {
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

  describe("server errors", () => {});
});
