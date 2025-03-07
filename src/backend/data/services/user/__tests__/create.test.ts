import { UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateService } from "../create";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateDataValidator } from "@/backend/data/validators";
import { MissingParamError } from "@/backend/domain/erros";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";

interface SutTypes {
  sut: UserCreateService;
  userRepository: UserRepository;
  loggerProvider: LoggerProvider;
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  userCreateDataValidator: UserCreateDataValidatorUseCase;
}

const makeSut = (): SutTypes => {
  const userRepository = new InMemoryUserRepository();
  const loggerProvider = new ConsoleLoggerProvider();
  const userCreateDataSanitizer = new UserCreateDataSanitizer();
  const userCreateDataValidator = new UserCreateDataValidator();
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
  const fixedDate = new Date("2007-01-01T00:00:00.000Z");
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "(99) 99999-9999",
    birthdate: fixedDate,
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
      const sanitizeSpy = jest.spyOn(userCreateDataSanitizer, "sanitize");
      await sut.create(userCreateData);
      expect(sanitizeSpy).toHaveBeenCalledWith(userCreateData);
    });

    it("should create user with correct values", async () => {
      const userCreateData = makeUserCreateData();
      const sanitizedData = userCreateDataSanitizer.sanitize(userCreateData);
      await sut.create(userCreateData);
      const user = await userRepository.findByEmail(userCreateData.email);
      expect(user).toMatchObject({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        birthdate: sanitizedData.birthdate,
        password: "hashed_password",
      });
    });
  });

  describe("logger", () => {
    it("should log user creation start", async () => {
      const userCreateData = makeUserCreateData();
      const loggerSpy = jest.spyOn(loggerProvider, "info");
      await sut.create(userCreateData);
      expect(loggerSpy).toHaveBeenCalledWith("Iniciando a criação de usuário", {
        action: "user.create.start",
        metadata: { email: userCreateData.email },
      });
    });

    it("should log user sanitized data", async () => {
      const userCreateData = makeUserCreateData();
      const loggerSpy = jest.spyOn(loggerProvider, "info");
      await sut.create(userCreateData);
      expect(loggerSpy).toHaveBeenCalledWith("Dados sanitizados", {
        action: "user.create.data.sanitized",
      });
    });

    it("should log user creation success", async () => {
      const userCreateData = makeUserCreateData();
      const loggerSpy = jest.spyOn(loggerProvider, "info");
      await sut.create(userCreateData);
      expect(loggerSpy).toHaveBeenCalledWith("Usuário criado com sucesso", {
        action: "user.created",
      });
    });

    it("should log user creation error", async () => {
      const userCreateData = makeUserCreateData();
      jest.spyOn(userRepository, "create").mockImplementationOnce(() => {
        throw new Error();
      });
      const loggerSpy = jest.spyOn(loggerProvider, "error");
      await expect(sut.create(userCreateData)).rejects.toThrow();
      expect(loggerSpy).toHaveBeenCalledWith("Erro ao criar usuário", {
        action: "user.creation.failed",
        metadata: { email: userCreateData.email },
        error: new Error(),
      });
    });
  });

  describe("sanitizer data", () => {
    it("should sanitize called with correct values", async () => {
      const userCreateData = makeUserCreateData();
      const sanitizeSpy = jest.spyOn(userCreateDataSanitizer, "sanitize");
      await sut.create(userCreateData);
      expect(sanitizeSpy).toHaveBeenCalledWith(userCreateData);
    });

    it("should sanitize user data before validation", async () => {
      const validatorSpy = jest.spyOn(userCreateDataValidator, "validate");
      const data = {
        name: "  John Doe  ",
        email: "  EMAIL@example.com  ",
        phone: "(11) 98765-4321",
        birthdate: fixedDate,
        password: "  password123  ",
      } as UserCreateData;
      const sanitizedData = userCreateDataSanitizer.sanitize(data);

      // O teste passa se não houver erros, indicando que os dados foram sanitizados corretamente
      await expect(sut.create(data)).resolves.not.toThrow();
      expect(validatorSpy).toHaveBeenCalledWith(sanitizedData);
    });

    it("should create user with sanitized data", async () => {
      const createSpy = jest.spyOn(userRepository, "create");
      const data = {
        name: "  John Doe  ",
        email: "  EMAIL@example.com  ",
        phone: "(11) 98765-4321",
        birthdate: fixedDate,
        password: "  password123  ",
      } as UserCreateData;
      const sanitizedData = userCreateDataSanitizer.sanitize(data);

      // O teste passa se não houver erros, indicando que os dados foram sanitizados corretamente
      await expect(sut.create(data)).resolves.not.toThrow();
      expect(createSpy).toHaveBeenCalledWith(sanitizedData);
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
        const validData = makeUserCreateData();
        const missingData = omitField(field, validData);

        await expect(sut.create(missingData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );
  });
});
