import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUniqueEmailValidatorUseCase,
} from "@/backend/domain/validators";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateService } from "../create";
import { UserRepository } from "@/backend/domain/repositories";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/erros";
import { UserCreateDataValidator } from "@/backend/data/validators";

interface SutTypes {
  sut: UserCreateService;
  userRepository: UserRepository;
  loggerProvider: LoggerProvider;
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
  userUniqueEmailValidator: UserUniqueEmailValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  userPasswordValidator: UserPasswordValidatorUseCase;
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
    userEmailValidator,
    userUniqueEmailValidator,
    userPhoneValidator,
    userBirthdateValidator,
    userPasswordValidator,
  };
};

describe("UserCreateService", () => {
  const fixedDate = new Date("2007-01-01T00:00:00.000Z");

  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email@mail.com",
    phone: "(99) 99999-9999",
    birthdate: fixedDate,
    password: "AB123ab@",
  });

  let sut: UserCreateService;
  let userRepository: UserRepository;
  let loggerProvider: LoggerProvider;
  let userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  let userEmailValidator: UserEmailValidatorUseCase;
  let userUniqueEmailValidator: UserUniqueEmailValidatorUseCase;
  let userPhoneValidator: UserPhoneValidatorUseCase;
  let userBirthdateValidator: UserBirthdateValidatorUseCase;
  let userPasswordValidator: UserPasswordValidatorUseCase;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
    loggerProvider = sutInstance.loggerProvider;
    userCreateDataSanitizer = sutInstance.userCreateDataSanitizer;
    userEmailValidator = sutInstance.userEmailValidator;
    userUniqueEmailValidator = sutInstance.userUniqueEmailValidator;
    userPhoneValidator = sutInstance.userPhoneValidator;
    userBirthdateValidator = sutInstance.userBirthdateValidator;
    userPasswordValidator = sutInstance.userPasswordValidator;
  });

  describe("success case", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    it("should create a new user", async () => {
      await expect(sut.create(userCreateData)).resolves.not.toThrow();
    });

    it("should call UserRepository.create with correct values", async () => {
      await sut.create(userCreateData);
      expect(userRepository.create).toHaveBeenCalledWith(userCreateData);
    });
  });

  describe("sanitizer data", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    it("should sanitize called with correct values", async () => {
      await sut.create(userCreateData);
      expect(userCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        userCreateData,
      );
    });
  });

  describe("validate data", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

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
        const missingData = omitField(field, userCreateData);

        await expect(sut.create(missingData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );
  });

  describe("logger", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    it("should log user creation start", async () => {
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
      await sut.create(userCreateData);
      expect(loggerProvider.info).toHaveBeenCalledWith("Dados sanitizados", {
        action: "user.create.data.sanitized",
      });
    });

    it("should log user creation success", async () => {
      await sut.create(userCreateData);
      expect(loggerProvider.info).toHaveBeenCalledWith(
        "Usuário criado com sucesso",
        {
          action: "user.created",
        },
      );
    });

    it("should log user creation error", async () => {
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
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

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
        userCreateData.email = email;

        if (shouldThrow) {
          jest
            .spyOn(userEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.create(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate unique email", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    // Casos de teste para validação de email duplicado
    const emailTestCases = [
      {
        scenario: "duplicated email",
        shouldThrow: true,
        errorMessage: "Email",
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
        if (shouldThrow) {
          jest
            .spyOn(userUniqueEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new DuplicateResourceError(errorMessage);
            });

          await expect(sut.create(userCreateData)).rejects.toThrow(
            new DuplicateResourceError(errorMessage),
          );
        } else {
          await expect(sut.create(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate phone format", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    // Casos de teste para validação de phone
    const phoneTestCases = [
      {
        scenario: "invalid phone",
        phone: "invalid-phone 3212211",
        shouldThrow: true,
        errorMessage: "telefone",
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
        userCreateData.phone = phone;

        if (shouldThrow) {
          jest
            .spyOn(userPhoneValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.create(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate birthdate format", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    // Casos de teste para validação de data de nascimento
    const birthdateTestCases = [
      {
        scenario: "invalid date",
        birthdate: "invalid-date" as unknown as Date,
        shouldThrow: true,
        errorMessage: "data de nascimento inválida.",
      },
      {
        scenario: "birthdate less then 18 years old",
        birthdate: new Date(),
        shouldThrow: true,
        errorMessage: "data de nascimento inválida.",
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
        userCreateData.birthdate = birthdate;

        if (shouldThrow) {
          jest
            .spyOn(userBirthdateValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.create(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate password format", () => {
    const userCreateData = makeUserCreateData();

    beforeEach(() => {
      jest
        .spyOn(userCreateDataSanitizer, "sanitize")
        .mockReturnValueOnce(userCreateData);
    });

    // Casos de teste para validação de senha
    const passwordTestCases = [
      {
        scenario: "less than 8 characters",
        password: "1234567",
        shouldThrow: true,
        errorMessage: "senha deve ter no mínimo 8 caracteres",
      },
      {
        scenario: "without uppercase letter",
        password: "1234567a",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra maiúscula",
      },
      {
        scenario: "without lowercase letter",
        password: "1234567B",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra minúscula",
      },
      {
        scenario: "without number",
        password: "ABCDEFab",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos um número",
      },
      {
        scenario: "without special character",
        password: "ABC123abc",
        shouldThrow: true,
        errorMessage:
          "senha deve ter pelo menos um caractere especial (@, #, $, %, etc.)",
      },
      {
        scenario: "exactly 8 characters",
        password: "AB12ab%*",
        shouldThrow: false,
        errorMessage: "",
      },
      {
        scenario: "more than 8 characters",
        password: "ABC123abc@",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(passwordTestCases)(
      "should handle password with $scenario",
      async ({ password, shouldThrow, errorMessage }) => {
        userCreateData.password = password;

        if (shouldThrow) {
          jest
            .spyOn(userPasswordValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });
          await expect(sut.create(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.create(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });
});
