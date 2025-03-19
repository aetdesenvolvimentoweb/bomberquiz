/**
 * Testes unitários para a classe UserUniqueEmailValidator
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * UserUniqueEmailValidator do contrato UserUniqueEmailValidatorUseCase.
 *
 * @group Unit
 * @group Validators
 * @group User
 */

import { UserUniqueEmailValidator } from "@/backend/data/validators";
import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/domain/repositories/user-repository";

// Mock do repositório de usuários
const mockUserRepository: jest.Mocked<UserRepository> = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

describe("UserUniqueEmailValidator", () => {
  let validator: UserUniqueEmailValidator;

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Cria uma nova instância do validador com o repositório mockado
    validator = new UserUniqueEmailValidator(mockUserRepository);
  });

  describe("validate method", () => {
    it("deve não lançar erro quando o e-mail não existe no sistema", async () => {
      // Arrange
      const email = "new-user@example.com";
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(validator.validate(email)).resolves.not.toThrow();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("deve lançar DuplicateResourceError quando o e-mail já existe", async () => {
      // Arrange
      const email = "existing-user@example.com";
      mockUserRepository.findByEmail.mockResolvedValue({
        id: "existing-id",
        email,
        name: "Existing User",
        password: "hashed-password",
        phone: "11987654321",
        birthdate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act & Assert
      await expect(validator.validate(email)).rejects.toThrow(
        DuplicateResourceError,
      );
      await expect(validator.validate(email)).rejects.toThrow(
        "E-mail já cadastrado no sistema",
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("deve propagar erros do repositório", async () => {
      // Arrange
      const email = "test@example.com";
      const repositoryError = new Error("Database connection failed");
      mockUserRepository.findByEmail.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(validator.validate(email)).rejects.toThrow(repositoryError);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("comportamento com diferentes formatos de e-mail", () => {
    it("deve passar o e-mail exatamente como recebido para o repositório", async () => {
      // Arrange
      const emails = [
        "user@example.com",
        "USER@EXAMPLE.COM",
        "user.name@example.com",
        "user+tag@example.com",
      ];
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      for (const email of emails) {
        await validator.validate(email);

        // Assert
        expect(mockUserRepository.findByEmail).toHaveBeenLastCalledWith(email);
      }
    });
  });

  describe("integração com o repositório", () => {
    it("deve chamar o método findByEmail do repositório apenas uma vez", async () => {
      // Arrange
      const email = "test@example.com";
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      await validator.validate(email);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });
});
