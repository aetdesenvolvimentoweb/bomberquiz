import {
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  UserCreateData,
} from "@/backend/domain/entities";
import { UserCreateService } from "../create";
import { UserRepository } from "@/backend/domain/repositories";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
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

  const sutInstance = makeSut();
  const sut = sutInstance.sut;
  const userRepository = sutInstance.userRepository;
  const loggerProvider = sutInstance.loggerProvider;
  const userCreateDataSanitizer = sutInstance.userCreateDataSanitizer;
  const userCreateDataValidator = sutInstance.userCreateDataValidator;

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

    it("should create user with correct values", async () => {
      const userCreateData = makeUserCreateData();
      jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
        ...userCreateData,
        id: "any_id",
        avatarUrl: USER_DEFAULT_AVATAR_URL,
        role: USER_DEFAULT_ROLE,
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await sut.create(userCreateData);
      const user = await userRepository.findByEmail(userCreateData.email);
      expect(user).toEqual(
        expect.objectContaining({
          ...userCreateData,
          password: "hashed_password",
        }),
      );
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
});
