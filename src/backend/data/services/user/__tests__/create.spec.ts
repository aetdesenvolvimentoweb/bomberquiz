import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateService } from "../create";
import { UserRepository } from "@/backend/domain/repositories";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { InvalidParamError, MissingParamError } from "@/backend/domain/erros";

interface SutTypes {
  sut: UserCreateService;
  userRepository: UserRepository;
  loggerProvider: LoggerProvider;
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  userCreateDataValidator: UserCreateDataValidatorUseCase;
}

const makeSut = (): SutTypes => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const loggerProvider = jest.mocked<LoggerProvider>({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  });
  const userCreateDataSanitizer = jest.mocked<UserCreateDataSanitizerUseCase>({
    sanitize: jest.fn(),
  });
  const userCreateDataValidator = jest.mocked<UserCreateDataValidatorUseCase>({
    validate: jest.fn(),
  });
  const sut = new UserCreateService({
    userRepository,
    loggerProvider,
    userCreateDataSanitizer,
    userCreateDataValidator,
  });
  return {
    sut,
    userRepository,
    loggerProvider,
    userCreateDataSanitizer,
    userCreateDataValidator,
  };
};

describe("UserCreateService", () => {
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "any_phone",
    birthdate: new Date(),
    password: "any_password",
  });

  let sut: UserCreateService;
  let userRepository: UserRepository;
  let loggerProvider: LoggerProvider;
  let userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  let userCreateDataValidator: UserCreateDataValidatorUseCase;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
    loggerProvider = sutInstance.loggerProvider;
    userCreateDataSanitizer = sutInstance.userCreateDataSanitizer;
    userCreateDataValidator = sutInstance.userCreateDataValidator;
  });

  describe("success case", () => {
    it("should create a new user", async () => {
      await expect(sut.create(makeUserCreateData())).resolves.not.toThrow();
    });

    it("should call UserRepository.create with correct values", async () => {
      const userCreateData = makeUserCreateData();
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
      await sut.create(userCreateData);
      expect(userRepository.create).toHaveBeenCalledWith(userCreateData);
    });
  });

  describe("sanitizer data", () => {
    it("should sanitize called with correct values", async () => {
      const userCreateData = makeUserCreateData();
      await sut.create(userCreateData);
      expect(userCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        userCreateData,
      );
    });
  });

  describe("validate data", () => {
    // Campos obrigatórios
    const requiredFields: { field: keyof UserCreateData; label: string }[] = [
      { field: "name", label: "nome" },
      { field: "email", label: "email" },
      { field: "phone", label: "telefone" },
      { field: "birthdate", label: "data de nascimento" },
      { field: "password", label: "senha" },
    ];

    // Função genérica para omitir um campo
    const omitField = (field: string, data: UserCreateData) => {
      return Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== field),
      ) as UserCreateData;
    };

    test.each(requiredFields)(
      "should throw a MissingParamError if $field is not provided",
      async ({ field, label }) => {
        jest
          .spyOn(userCreateDataValidator, "validate")
          .mockImplementationOnce(() => {
            throw new MissingParamError(label);
          });
        const validData = makeUserCreateData();
        const missingData = omitField(field, validData);

        await expect(sut.create(missingData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );
  });

  describe("logger", () => {
    it("should log user creation start", async () => {
      const userCreateData = makeUserCreateData();
      await sut.create(userCreateData);
      expect(loggerProvider.info).toHaveBeenCalledWith(
        "Iniciando a criação de usuário",
        {
          action: "user.create.start",
          metadata: { email: userCreateData.email },
        },
      );
    });

    it("should log user sanitized data", async () => {
      const userCreateData = makeUserCreateData();
      await sut.create(userCreateData);
      expect(loggerProvider.info).toHaveBeenCalledWith("Dados sanitizados", {
        action: "user.create.data.sanitized",
      });
    });

    it("should log user creation success", async () => {
      const userCreateData = makeUserCreateData();
      await sut.create(userCreateData);
      expect(loggerProvider.info).toHaveBeenCalledWith(
        "Usuário criado com sucesso",
        {
          action: "user.created",
        },
      );
    });

    it("should log user creation error", async () => {
      const userCreateData = makeUserCreateData();
      jest.spyOn(userRepository, "create").mockRejectedValueOnce(new Error());
      await expect(sut.create(userCreateData)).rejects.toThrow();
      expect(loggerProvider.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        {
          action: "user.creation.failed",
          metadata: { email: userCreateData.email },
          error: new Error(),
        },
      );
    });
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
        const validData = makeUserCreateData();
        validData.email = email;

        if (shouldThrow) {
          jest
            .spyOn(userCreateDataValidator, "validate")
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
});
