/**
 * Testes de integração para a classe UserCreateService
 *
 * Este arquivo contém testes que verificam a integração entre o
 * UserCreateService e suas dependências reais da camada de dados,
 * como repositório, sanitizador e validador, enquanto faz mock
 * das dependências da camada de infraestrutura.
 *
 * Diferente dos testes unitários, estes testes verificam como os
 * componentes reais da camada de dados interagem entre si, garantindo
 * que a integração entre eles funcione corretamente.
 *
 * @group Integration
 * @group Services
 * @group User
 */

import { InMemoryUserRepository } from "@/backend/data/repositories";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
} from "@/backend/domain/errors";
import { HashProvider, LoggerProvider } from "@/backend/domain/providers";
import { XssSanitizerUseCase } from "@/backend/domain/sanitizers";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";

// Mocks para os validadores específicos
const mockEmailValidator: jest.Mocked<UserEmailValidatorUseCase> = {
  validate: jest.fn(),
};

const mockPhoneValidator: jest.Mocked<UserPhoneValidatorUseCase> = {
  validate: jest.fn(),
};

const mockBirthdateValidator: jest.Mocked<UserBirthdateValidatorUseCase> = {
  validate: jest.fn(),
};

const mockPasswordValidator: jest.Mocked<UserPasswordValidatorUseCase> = {
  validate: jest.fn(),
};

// Mocks para as dependências da camada de infraestrutura
const mockXssSanitizer: jest.Mocked<XssSanitizerUseCase> = {
  sanitize: jest.fn(),
};

const mockHashProvider: jest.Mocked<HashProvider> = {
  hash: jest.fn(),
  compare: jest.fn(),
  withOptions: jest.fn().mockReturnThis(),
};

const mockLoggerProvider: jest.Mocked<LoggerProvider> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  withContext: jest.fn().mockReturnThis(),
};

describe("UserCreateService - Testes de Integração", () => {
  let userCreateService: UserCreateService;
  let userRepository: InMemoryUserRepository;
  let userCreateDataSanitizer: UserCreateDataSanitizer;
  let uniqueEmailValidator: UserUniqueEmailValidator;
  let userCreateDataValidator: UserCreateDataValidator;
  let userData: UserCreateData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Configurar comportamento dos mocks da camada de infraestrutura
    mockXssSanitizer.sanitize.mockImplementation((text) => {
      // Implementação simples para remover tags HTML
      return text ? text.replace(/<[^>]*>/g, "") : "";
    });

    mockHashProvider.hash.mockImplementation(async (text) => {
      // Simulação simples de hash (não usar em produção!)
      return `hashed_${text}`;
    });

    mockHashProvider.compare.mockImplementation(
      async (plaintext, hashedText) => {
        // Verifica se o hash simulado corresponde
        return hashedText === `hashed_${plaintext}`;
      },
    );

    // Configurar comportamento padrão dos mocks de validadores
    mockEmailValidator.validate.mockImplementation(() => {});
    mockPhoneValidator.validate.mockImplementation(() => {});
    mockBirthdateValidator.validate.mockImplementation(() => {});
    mockPasswordValidator.validate.mockImplementation(() => {});

    // Criar instâncias reais das dependências da camada de dados
    userRepository = new InMemoryUserRepository();
    userCreateDataSanitizer = new UserCreateDataSanitizer(mockXssSanitizer);
    uniqueEmailValidator = new UserUniqueEmailValidator(userRepository);

    userCreateDataValidator = new UserCreateDataValidator({
      userEmailValidator: mockEmailValidator,
      userUniqueEmailValidator: uniqueEmailValidator,
      userPhoneValidator: mockPhoneValidator,
      userBirthdateValidator: mockBirthdateValidator,
      userPasswordValidator: mockPasswordValidator,
    });

    // Criar instância do serviço com dependências reais da camada de dados
    // e mocks da camada de infraestrutura
    userCreateService = new UserCreateService({
      userRepository,
      userCreateDataSanitizer,
      userCreateDataValidator: userCreateDataValidator,
      hashProvider: mockHashProvider,
      loggerProvider: mockLoggerProvider,
    });

    // Dados de exemplo para usuário
    userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password123!",
      phone: "(11) 98765-4321",
      birthdate: new Date("1990-01-01"),
    };
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe("create method", () => {
    /**
     * Testa se o serviço cria um usuário com sucesso quando todos os dados são válidos.
     *
     * Verifica se:
     * - O usuário é persistido no repositório
     * - Os dados são normalizados corretamente (email, telefone)
     * - A senha é hasheada adequadamente
     */
    it("deve criar um usuário com sucesso quando todos os dados são válidos", async () => {
      // Act
      await userCreateService.create(userData);

      // Assert
      // Verificar se o usuário foi persistido no repositório
      const createdUser = await userRepository.findByEmail(userData.email);

      expect(createdUser).toBeTruthy();
      expect(createdUser?.name).toBe(userData.name);
      expect(createdUser?.email).toBe(userData.email.toLowerCase()); // Email é normalizado para lowercase
      expect(createdUser?.phone).toBe("11987654321"); // Telefone é sanitizado

      // A senha deve ter sido hasheada (não deve ser igual à original)
      expect(createdUser?.password).not.toBe(userData.password);

      // Verificar que a senha hasheada é válida usando o compare do mockHashProvider
      const isPasswordValid = await mockHashProvider.compare(
        userData.password,
        createdUser?.password || "",
      );
      expect(isPasswordValid).toBe(true);
    });

    /**
     * Testa se o serviço sanitiza corretamente os dados de entrada.
     *
     * Verifica se:
     * - Espaços extras são removidos do nome
     * - Email é normalizado para minúsculas
     * - Caracteres não numéricos são removidos do telefone
     */
    it("deve sanitizar corretamente os dados de entrada", async () => {
      // Arrange - dados com espaços extras e formatação inconsistente
      const dirtyData: UserCreateData = {
        name: "  John  Doe  ",
        email: " JOHN.DOE@EXAMPLE.COM  ",
        password: "Password123!",
        phone: "(11) 98765-4321",
        birthdate: new Date("1990-01-01"),
      };

      // Act
      await userCreateService.create(dirtyData);

      // Assert
      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );

      expect(createdUser).toBeTruthy();
      expect(createdUser?.name).toBe("John Doe"); // Espaços extras removidos
      expect(createdUser?.email).toBe("john.doe@example.com"); // Email normalizado
      expect(createdUser?.phone).toBe("11987654321"); // Telefone sanitizado
    });

    /**
     * Testa se o serviço rejeita a criação de um usuário quando o email já está em uso.
     *
     * Verifica se:
     * - Uma exceção DuplicateResourceError é lançada
     * - Apenas o primeiro usuário é persistido no repositório
     */
    it("deve rejeitar quando o email já está em uso", async () => {
      // Arrange - criar um usuário primeiro
      await userCreateService.create(userData);

      // Criar outro usuário com o mesmo email mas outros dados diferentes
      const duplicateEmailUser: UserCreateData = {
        ...userData,
        name: "Jane Doe",
        phone: "(11) 12345-6789",
      };

      // Act & Assert
      await expect(
        userCreateService.create(duplicateEmailUser),
      ).rejects.toThrow(DuplicateResourceError);

      // Verificar que apenas o primeiro usuário foi persistido
      const firstUser = await userRepository.findByEmail(userData.email);
      expect(firstUser).toBeTruthy();
      expect(firstUser?.name).toBe("John Doe");
    });

    /**
     * Testa se o serviço propaga erros de validação de email.
     *
     * Verifica se:
     * - Uma exceção InvalidParamError é propagada
     * - Nenhum usuário é persistido no repositório
     */
    it("deve propagar erro quando a validação de email falha", async () => {
      // Arrange
      const validationError = new InvalidParamError(
        "email",
        "formato inválido",
      );
      mockEmailValidator.validate.mockImplementation(() => {
        throw validationError;
      });

      // Act & Assert
      await expect(userCreateService.create(userData)).rejects.toThrow(
        validationError,
      );

      // Verificar que nenhum usuário foi persistido
      const user = await userRepository.findByEmail(userData.email);
      expect(user).toBeNull();
    });

    /**
     * Testa se o serviço permite criar múltiplos usuários com emails diferentes.
     *
     * Verifica se:
     * - Ambos os usuários são persistidos corretamente
     * - Os dados de cada usuário são mantidos separadamente
     */
    it("deve permitir criar múltiplos usuários com emails diferentes", async () => {
      // Arrange
      const secondUser: UserCreateData = {
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "AnotherPassword456!",
        phone: "(11) 12345-6789",
        birthdate: new Date("1992-05-15"),
      };

      // Act
      await userCreateService.create(userData);
      await userCreateService.create(secondUser);

      // Assert
      const john = await userRepository.findByEmail("john.doe@example.com");
      const jane = await userRepository.findByEmail("jane.doe@example.com");

      expect(john).toBeTruthy();
      expect(jane).toBeTruthy();
      expect(john?.name).toBe("John Doe");
      expect(jane?.name).toBe("Jane Doe");
    });

    /**
     * Testa se o serviço lida corretamente com dados de entrada contendo caracteres especiais.
     *
     * Verifica se:
     * - Tags HTML potencialmente perigosas são removidas do nome
     * - O usuário é persistido com os dados sanitizados
     */
    it("deve lidar com dados de entrada com caracteres especiais no nome", async () => {
      // Arrange - nome com possíveis vetores de XSS
      const xssData: UserCreateData = {
        name: "John <script>alert('XSS')</script> Doe",
        email: "john.doe@example.com",
        password: "Password123!",
        phone: "(11) 98765-4321",
        birthdate: new Date("1990-01-01"),
      };

      // Act
      await userCreateService.create(xssData);

      // Assert
      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );

      expect(createdUser).toBeTruthy();
      // O sanitizador XSS deve ter removido a tag script
      expect(createdUser?.name).not.toContain("<script>");
      expect(createdUser?.name).not.toContain("</script>");
    });
  });
});
