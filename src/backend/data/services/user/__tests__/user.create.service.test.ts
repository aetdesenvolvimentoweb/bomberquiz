import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
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
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { LoggerProviderMock } from "@/backend/__mocks__/logger.provider.mock";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";
import { UserCreateService } from "../user.create.service";
import { UserRepository } from "@/backend/domain/repositories";

interface SutResponses {
  sut: UserCreateService;
  userRepository: UserRepository;
  userCreateDataValidator: UserCreateDataValidatorUseCase;
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  hashProvider: HashProviderMock;
  loggerProvider: LoggerProviderMock;
  userBirthdateValidator: UserBirthdateValidatorMock;
  userEmailValidator: UserEmailValidatorMock;
  userPasswordValidator: UserPasswordValidator;
  userPhoneValidator: UserPhoneValidatorMock;
}

/**
 * Teste de integração para o caso de uso de criação de usuário
 *
 * Este teste verifica a integração entre:
 * - UserCreateService (implementação do caso de uso)
 * - UserCreateValidator (validador de dados)
 * - UserCreateDataSanitizer (sanitizador de dados)
 * - InMemoryUserRepository (repositório)
 * - Validadores específicos (email, senha, telefone, data de nascimento)
 */
describe("UserCreateService Integration", () => {
  const makeSut = (): SutResponses => {
    // Mocks e dependências
    const hashProvider = new HashProviderMock();
    const loggerProvider = new LoggerProviderMock();
    const userRepository = new InMemoryUserRepository();
    const userCreateDataSanitizer = new UserCreateDataSanitizer();

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

    // Serviço (implementação do caso de uso)
    const sut = new UserCreateService({
      userRepository,
      hashProvider,
      loggerProvider,
      userCreateDataSanitizer,
      userCreateDataValidator,
    });

    return {
      sut,
      userRepository,
      userCreateDataValidator,
      userCreateDataSanitizer,
      hashProvider,
      loggerProvider,
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
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
    it("should create a user with valid data", async () => {
      const { sut, userRepository, userCreateDataSanitizer } = makeSut();
      const userData = makeValidUserData();
      const sanitedData = userCreateDataSanitizer.sanitize(userData);

      await expect(sut.create(userData)).resolves.not.toThrow();

      const createdUser = await userRepository.findByEmail(userData.email);
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe(sanitedData.name);
      expect(createdUser?.email).toBe(sanitedData.email);
      expect(createdUser?.phone).toBe(sanitedData.phone);
      expect(createdUser?.birthdate).toEqual(sanitedData.birthdate);
      // A senha deve estar hasheada
      expect(createdUser?.password).not.toBe(sanitedData.password);
    });

    it("should sanitize data before creating the user", async () => {
      const { sut, userRepository, userCreateDataSanitizer } = makeSut();
      const sanitizeSpy = jest.spyOn(userCreateDataSanitizer, "sanitize");

      const userData: UserCreateData = {
        name: "  John Doe  ", // Com espaços extras
        email: "JOHN.DOE@EXAMPLE.COM", // Em maiúsculas
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      await expect(sut.create(userData)).resolves.not.toThrow();

      expect(sanitizeSpy).toHaveBeenCalledWith(userData);

      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("John Doe"); // Sem espaços extras
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas
    });

    it("should validate data before creating the user", async () => {
      const { sut, userCreateDataValidator, userCreateDataSanitizer } =
        makeSut();
      const validateSpy = jest.spyOn(userCreateDataValidator, "validate");

      const userData = makeValidUserData();
      const sanitedData = userCreateDataSanitizer.sanitize(userData);

      await expect(sut.create(userData)).resolves.not.toThrow();

      expect(validateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: sanitedData.name,
          email: sanitedData.email,
          phone: sanitedData.phone,
          birthdate: sanitedData.birthdate,
          password: sanitedData.password,
        }),
      );
    });

    it("should hash the password before saving to repository", async () => {
      const { sut, hashProvider, userRepository } = makeSut();
      const hashSpy = jest.spyOn(hashProvider, "hash");

      const userData = makeValidUserData();

      await expect(sut.create(userData)).resolves.not.toThrow();

      expect(hashSpy).toHaveBeenCalledWith(userData.password);

      const createdUser = await userRepository.findByEmail(userData.email);
      expect(createdUser?.password).not.toBe(userData.password);
    });

    it("should log during the creation process", async () => {
      const { sut, loggerProvider } = makeSut();
      const infoSpy = jest.spyOn(loggerProvider, "info");
      const debugSpy = jest.spyOn(loggerProvider, "debug");

      const userData = makeValidUserData();

      await expect(sut.create(userData)).resolves.not.toThrow();

      expect(infoSpy).toHaveBeenCalledWith(
        "Iniciando criação de usuário",
        expect.objectContaining({
          action: "user_create_started",
          metadata: { email: userData.email },
        }),
      );

      expect(debugSpy).toHaveBeenCalledWith(
        "Dados de usuário sanitizados",
        expect.objectContaining({
          action: "user_data_sanitized",
        }),
      );

      expect(debugSpy).toHaveBeenCalledWith(
        "Dados de usuário validados com sucesso",
        expect.objectContaining({
          action: "user_data_validated",
        }),
      );

      expect(infoSpy).toHaveBeenCalledWith(
        "Usuário criado com sucesso",
        expect.objectContaining({
          action: "user_created",
        }),
      );
    });
  });

  describe("Error flow", () => {
    it("should throw MissingParamError when a required field is missing", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();

      const createDataWithoutName = {
        email: validData.email,
        phone: validData.phone,
        birthdate: validData.birthdate,
        password: validData.password,
      } as UserCreateData;

      await expect(sut.create(createDataWithoutName)).rejects.toThrow(
        MissingParamError,
      );
      await expect(sut.create(createDataWithoutName)).rejects.toThrow(
        "Parâmetro obrigatório não informado: nome",
      );
    });

    it("should throw InvalidParamError when password is too short", async () => {
      const { sut } = makeSut();

      const userData = makeValidUserData();
      userData.password = "123"; // Senha muito curta

      await expect(sut.create(userData)).rejects.toThrow(InvalidParamError);
      await expect(sut.create(userData)).rejects.toThrow(
        "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
      );
    });

    it("should throw DuplicateResourceError when email is already registered", async () => {
      const { sut } = makeSut();

      const userData = makeValidUserData();

      // Primeira criação deve ser bem-sucedida
      await expect(sut.create(userData)).resolves.not.toThrow();

      // Segunda criação com o mesmo email deve falhar
      await expect(sut.create(userData)).rejects.toThrow(
        DuplicateResourceError,
      );
      await expect(sut.create(userData)).rejects.toThrow(
        "Email já cadastrado no sistema",
      );
    });

    it("should log errors when an exception occurs", async () => {
      const { sut, loggerProvider, userCreateDataValidator } = makeSut();
      const errorSpy = jest.spyOn(loggerProvider, "error");

      // Forçar um erro na validação
      jest
        .spyOn(userCreateDataValidator, "validate")
        .mockRejectedValueOnce(new Error("Erro forçado"));

      const userData = makeValidUserData();

      await expect(sut.create(userData)).rejects.toThrow("Erro forçado");

      expect(errorSpy).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          action: "user_creation_failed",
          metadata: { email: userData.email },
          error: expect.any(Error),
        }),
      );
    });
  });
});
