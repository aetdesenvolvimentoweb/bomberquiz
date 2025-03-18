/**
 * Testes unitários para a classe Argon2Hash
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * Argon2Hash do contrato HashProvider.
 *
 * @group Unit
 * @group Providers
 * @group Security
 */

import { Argon2Hash } from "@/backend/infra/providers";
import argon2 from "argon2";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";

// Mock do módulo argon2
jest.mock("argon2", () => ({
  argon2id: 2, // Valor real usado pela biblioteca
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe("Argon2Hash", () => {
  // Limpa todos os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("deve criar uma instância com opções padrão", () => {
      // Act
      const hasher = new Argon2Hash();

      // Assert
      expect(hasher).toBeInstanceOf(Argon2Hash);
    });

    it("deve criar uma instância com opções personalizadas", () => {
      // Arrange
      const customOptions = {
        iterations: 5,
        memoryCost: 131072, // 128 MiB
      };

      // Act
      const hasher = new Argon2Hash(customOptions);

      // Assert
      expect(hasher).toBeInstanceOf(Argon2Hash);

      // Verificar se as opções são aplicadas no hash
      hasher.hash("password");
      expect(argon2.hash).toHaveBeenCalledWith(
        "password",
        expect.objectContaining({
          timeCost: customOptions.iterations,
          memoryCost: customOptions.memoryCost,
        }),
      );
    });
  });

  describe("hash method", () => {
    it("deve chamar argon2.hash com as opções padrão", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const mockHash =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.hash
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act
      const result = await hasher.hash(plaintext);

      // Assert
      expect(argon2.hash).toHaveBeenCalledWith(
        plaintext,
        expect.objectContaining({
          type: argon2.argon2id,
          memoryCost: 65536,
          timeCost: 3,
          parallelism: 4,
          hashLength: 32,
        }),
      );
      expect(result).toBe(mockHash);
    });

    it("deve chamar argon2.hash com opções personalizadas por chamada", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const customOptions = {
        iterations: 4,
        memoryCost: 131072, // 128 MiB
      };
      const mockHash =
        "$argon2id$v=19$m=131072,t=4,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.hash
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act
      const result = await hasher.hash(plaintext, customOptions);

      // Assert
      expect(argon2.hash).toHaveBeenCalledWith(
        plaintext,
        expect.objectContaining({
          type: argon2.argon2id,
          memoryCost: customOptions.memoryCost,
          timeCost: customOptions.iterations,
          parallelism: 4,
          hashLength: 32,
        }),
      );
      expect(result).toBe(mockHash);
    });

    it("deve lançar InvalidParamError quando o texto for vazio", async () => {
      // Arrange
      const hasher = new Argon2Hash();

      // Act & Assert
      await expect(hasher.hash("")).rejects.toThrow(InvalidParamError);
      await expect(hasher.hash(null as unknown as string)).rejects.toThrow(
        InvalidParamError,
      );
      await expect(hasher.hash(undefined as unknown as string)).rejects.toThrow(
        InvalidParamError,
      );
    });

    it("deve lançar ServerError quando argon2.hash lançar um erro", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const mockError = new Error("Argon2 error");

      // Mock do erro do argon2.hash
      (argon2.hash as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(hasher.hash(plaintext)).rejects.toThrow(ServerError);
    });

    // Novo teste para cobrir o caso de erro não-Error
    it("deve lançar ServerError quando argon2.hash lançar um erro que não é instância de Error", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";

      // Mock do erro do argon2.hash com um valor que não é Error
      (argon2.hash as jest.Mock).mockRejectedValue("string error");

      // Act & Assert
      await expect(hasher.hash(plaintext)).rejects.toThrow(ServerError);
      await expect(hasher.hash(plaintext)).rejects.toThrow(
        "Erro desconhecido durante o processo de hash",
      );
    });
  });

  describe("compare method", () => {
    it("deve chamar argon2.verify com os parâmetros corretos", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const hashedText =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.verify
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await hasher.compare(plaintext, hashedText);

      // Assert
      expect(argon2.verify).toHaveBeenCalledWith(hashedText, plaintext);
      expect(result).toBe(true);
    });

    it("deve retornar false quando a senha não corresponder ao hash", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "wrongpassword";
      const hashedText =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.verify
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await hasher.compare(plaintext, hashedText);

      // Assert
      expect(result).toBe(false);
    });

    it("deve lançar InvalidParamError quando o texto for vazio", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const hashedText =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Act & Assert
      await expect(hasher.compare("", hashedText)).rejects.toThrow(
        InvalidParamError,
      );
      await expect(
        hasher.compare(null as unknown as string, hashedText),
      ).rejects.toThrow(InvalidParamError);
      await expect(
        hasher.compare(undefined as unknown as string, hashedText),
      ).rejects.toThrow(InvalidParamError);
    });

    it("deve lançar InvalidParamError quando o hash for vazio", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";

      // Act & Assert
      await expect(hasher.compare(plaintext, "")).rejects.toThrow(
        InvalidParamError,
      );
      await expect(
        hasher.compare(plaintext, null as unknown as string),
      ).rejects.toThrow(InvalidParamError);
      await expect(
        hasher.compare(plaintext, undefined as unknown as string),
      ).rejects.toThrow(InvalidParamError);
    });

    it("deve lançar InvalidParamError quando o hash tiver formato inválido", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const invalidHash = "invalid-hash-format";

      // Mock do erro do argon2.verify com mensagem específica de formato inválido
      const mockError = new Error("invalid hash");
      (argon2.verify as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(hasher.compare(plaintext, invalidHash)).rejects.toThrow(
        InvalidParamError,
      );
    });

    it("deve lançar ServerError quando argon2.verify lançar um erro não relacionado a formato", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const hashedText =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do erro do argon2.verify com mensagem genérica
      const mockError = new Error("Argon2 internal error");
      (argon2.verify as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(hasher.compare(plaintext, hashedText)).rejects.toThrow(
        ServerError,
      );
    });

    // Novo teste para cobrir o caso de erro não-Error
    it("deve lançar ServerError quando argon2.verify lançar um erro que não é instância de Error", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const plaintext = "password123";
      const hashedText =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do erro do argon2.verify com um valor que não é Error
      (argon2.verify as jest.Mock).mockRejectedValue("string error");

      // Act & Assert
      await expect(hasher.compare(plaintext, hashedText)).rejects.toThrow(
        ServerError,
      );
      await expect(hasher.compare(plaintext, hashedText)).rejects.toThrow(
        "Erro desconhecido durante a verificação do hash",
      );
    });
  });

  describe("withOptions method", () => {
    it("deve criar uma nova instância com opções combinadas", async () => {
      // Arrange
      const initialOptions = {
        iterations: 3,
        memoryCost: 65536,
      };

      const additionalOptions = {
        iterations: 4,
        parallelism: 8,
      };

      const hasher = new Argon2Hash(initialOptions);
      const mockHash =
        "$argon2id$v=19$m=65536,t=4,p=8$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.hash
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act
      const customHasher = hasher.withOptions(additionalOptions);
      await customHasher.hash("password");

      // Assert
      expect(argon2.hash).toHaveBeenCalledWith(
        "password",
        expect.objectContaining({
          memoryCost: initialOptions.memoryCost, // Mantido do inicial
          timeCost: additionalOptions.iterations, // Sobrescrito pelo adicional
          parallelism: additionalOptions.parallelism, // Adicionado pelo adicional
        }),
      );
    });

    it("deve retornar uma nova instância, não modificando a original", async () => {
      // Arrange
      const hasher = new Argon2Hash();
      const mockHash =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";

      // Mock do retorno do argon2.hash
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act
      const customHasher = hasher.withOptions({ iterations: 5 });

      // Usar a instância original
      await hasher.hash("password");

      // Assert
      expect(argon2.hash).toHaveBeenLastCalledWith(
        "password",
        expect.objectContaining({
          timeCost: 3, // Valor padrão, não 5
        }),
      );

      // Limpar mock para o próximo teste
      jest.clearAllMocks();

      // Usar a instância personalizada
      await customHasher.hash("password");

      // Assert
      expect(argon2.hash).toHaveBeenLastCalledWith(
        "password",
        expect.objectContaining({
          timeCost: 5, // Valor personalizado
        }),
      );
    });
  });

  describe("integração com diferentes opções", () => {
    it("deve aplicar corretamente diferentes combinações de opções", async () => {
      // Arrange
      const testCases = [
        {
          constructorOptions: {},
          methodOptions: { iterations: 5 },
          expected: { timeCost: 5, memoryCost: 65536, parallelism: 4 },
        },
        {
          constructorOptions: { memoryCost: 131072 },
          methodOptions: {},
          expected: { timeCost: 3, memoryCost: 131072, parallelism: 4 },
        },
        {
          constructorOptions: { parallelism: 8 },
          methodOptions: { memoryCost: 262144 },
          expected: { timeCost: 3, memoryCost: 262144, parallelism: 8 },
        },
      ];

      const mockHash =
        "$argon2id$v=19$m=65536,t=3,p=4$abcdefghijklmnop$hashedpassword";
      (argon2.hash as jest.Mock).mockResolvedValue(mockHash);

      // Act & Assert
      for (const testCase of testCases) {
        jest.clearAllMocks();

        const hasher = new Argon2Hash(testCase.constructorOptions);
        await hasher.hash("password", testCase.methodOptions);

        expect(argon2.hash).toHaveBeenCalledWith(
          "password",
          expect.objectContaining({
            timeCost: testCase.expected.timeCost,
            memoryCost: testCase.expected.memoryCost,
            parallelism: testCase.expected.parallelism,
          }),
        );
      }
    });
  });
});
