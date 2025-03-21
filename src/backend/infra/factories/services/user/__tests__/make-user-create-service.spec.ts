/**
 * Testes unitários para a factory function makeUserCreateService
 *
 * Este arquivo contém testes que verificam se a factory function
 * makeUserCreateService cria e configura corretamente uma instância
 * de UserCreateService com todas as suas dependências.
 *
 * @group Unit
 * @group Factories
 * @group Services
 */

import { makeUserCreateService } from "@/backend/infra/factories/services/user/make-user-create-service";
import { UserCreateService } from "@/backend/data/services";
import { InMemoryUserRepository } from "@/backend/data/repositories";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import {
  DateFnsBirthdateValidatorAdapter,
  LibphonenumberPhoneValidator,
  PasswordValidatorAdapter,
  ValidatorEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { Argon2Hash, ConsoleLogger } from "@/backend/infra/providers";
import { DOMPurifyXssSanitizer } from "@/backend/infra/sanitizers";

// Mocks para as classes utilizadas
jest.mock("@/backend/data/services");
jest.mock("@/backend/data/repositories");
jest.mock("@/backend/data/sanitizers");
jest.mock("@/backend/data/validators");
jest.mock("@/backend/infra/adapters");
jest.mock("@/backend/infra/providers");
jest.mock("@/backend/infra/sanitizers");

describe("makeUserCreateService", () => {
  // Limpa todos os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma instância de UserCreateService com as dependências corretas", () => {
    // Act
    const userCreateService = makeUserCreateService();

    // Assert
    // Verifica se retorna uma instância de UserCreateService
    expect(userCreateService).toBeInstanceOf(UserCreateService);

    // Verifica se as classes de dependência foram instanciadas
    expect(Argon2Hash).toHaveBeenCalledTimes(1);
    expect(ConsoleLogger).toHaveBeenCalledTimes(1);
    expect(DOMPurifyXssSanitizer).toHaveBeenCalledTimes(1);
    expect(UserCreateDataSanitizer).toHaveBeenCalledTimes(1);
    expect(InMemoryUserRepository).toHaveBeenCalledTimes(1);
    expect(DateFnsBirthdateValidatorAdapter).toHaveBeenCalledTimes(1);
    expect(ValidatorEmailValidatorAdapter).toHaveBeenCalledTimes(1);
    expect(PasswordValidatorAdapter).toHaveBeenCalledTimes(1);
    expect(LibphonenumberPhoneValidator).toHaveBeenCalledTimes(1);
    expect(UserUniqueEmailValidator).toHaveBeenCalledTimes(1);
    expect(UserCreateDataValidator).toHaveBeenCalledTimes(1);
    expect(UserCreateService).toHaveBeenCalledTimes(1);
  });

  it("deve configurar o UserCreateDataSanitizer com o XssSanitizer correto", () => {
    // Arrange
    const mockXssSanitizer = {};
    (DOMPurifyXssSanitizer as jest.Mock).mockReturnValue(mockXssSanitizer);

    // Act
    makeUserCreateService();

    // Assert
    expect(UserCreateDataSanitizer).toHaveBeenCalledWith(mockXssSanitizer);
  });

  it("deve configurar o UserUniqueEmailValidator com o UserRepository correto", () => {
    // Arrange
    const mockUserRepository = {};
    (InMemoryUserRepository as jest.Mock).mockReturnValue(mockUserRepository);

    // Act
    makeUserCreateService();

    // Assert
    expect(UserUniqueEmailValidator).toHaveBeenCalledWith(mockUserRepository);
  });

  it("deve configurar o UserCreateDataValidator com todos os validadores corretos", () => {
    // Arrange
    const mockBirthdateValidator = {};
    const mockEmailValidator = {};
    const mockPasswordValidator = {};
    const mockPhoneValidator = {};
    const mockUniqueEmailValidator = {};

    (DateFnsBirthdateValidatorAdapter as jest.Mock).mockReturnValue(
      mockBirthdateValidator,
    );
    (ValidatorEmailValidatorAdapter as jest.Mock).mockReturnValue(
      mockEmailValidator,
    );
    (PasswordValidatorAdapter as jest.Mock).mockReturnValue(
      mockPasswordValidator,
    );
    (LibphonenumberPhoneValidator as jest.Mock).mockReturnValue(
      mockPhoneValidator,
    );
    (UserUniqueEmailValidator as jest.Mock).mockReturnValue(
      mockUniqueEmailValidator,
    );

    // Act
    makeUserCreateService();

    // Assert
    expect(UserCreateDataValidator).toHaveBeenCalledWith({
      userBirthdateValidator: mockBirthdateValidator,
      userEmailValidator: mockEmailValidator,
      userPasswordValidator: mockPasswordValidator,
      userPhoneValidator: mockPhoneValidator,
      userUniqueEmailValidator: mockUniqueEmailValidator,
    });
  });

  it("deve configurar o UserCreateService com todas as dependências corretas", () => {
    // Arrange
    const mockHashProvider = {};
    const mockLoggerProvider = {};
    const mockUserCreateDataSanitizer = {};
    const mockUserRepository = {};
    const mockUserCreateDataValidator = {};

    (Argon2Hash as jest.Mock).mockReturnValue(mockHashProvider);
    (ConsoleLogger as jest.Mock).mockReturnValue(mockLoggerProvider);
    (UserCreateDataSanitizer as jest.Mock).mockReturnValue(
      mockUserCreateDataSanitizer,
    );
    (InMemoryUserRepository as jest.Mock).mockReturnValue(mockUserRepository);
    (UserCreateDataValidator as jest.Mock).mockReturnValue(
      mockUserCreateDataValidator,
    );

    // Act
    makeUserCreateService();

    // Assert
    expect(UserCreateService).toHaveBeenCalledWith({
      hashProvider: mockHashProvider,
      loggerProvider: mockLoggerProvider,
      userCreateDataSanitizer: mockUserCreateDataSanitizer,
      userRepository: mockUserRepository,
      userCreateDataValidator: mockUserCreateDataValidator,
    });
  });
});
