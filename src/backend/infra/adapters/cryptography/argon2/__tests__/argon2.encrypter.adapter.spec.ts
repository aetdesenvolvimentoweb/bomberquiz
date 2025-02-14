import { Argon2EncrypterAdapter } from "../argon2.encrypter.adapter";
import { EncrypterUseCase } from "@/backend/domain/use-cases";
import argon2 from "argon2";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: EncrypterUseCase;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const sut = new Argon2EncrypterAdapter();
  return { sut };
};

describe("Argon2EncrypterAdapter", () => {
  let sut: EncrypterUseCase;

  beforeAll(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa a criptografia de senha
   */
  describe("encrypt", () => {
    test("should encrypt password successfully", async () => {
      const password = "valid_password";
      const hash = "hashed_password";

      jest.spyOn(argon2, "hash").mockResolvedValue(hash);

      const result = await sut.encrypt(password);

      expect(result).toBe(hash);
    });

    test("should throw if encryption fails", async () => {
      jest
        .spyOn(argon2, "hash")
        .mockRejectedValue(new Error("Erro ao criptografar senha"));

      await expect(sut.encrypt("any_password")).rejects.toThrow(
        "Erro ao criptografar senha"
      );
    });
  });

  /**
   * Testa a verificação de senha
   */
  describe("verify", () => {
    test("should return true for valid password", async () => {
      jest.spyOn(argon2, "verify").mockResolvedValue(true);

      const isValid = await sut.verify({
        password: "valid_password",
        passwordHash: "valid_hash",
      });

      expect(isValid).toBe(true);
    });

    test("should return false for invalid password", async () => {
      jest.spyOn(argon2, "verify").mockResolvedValue(false);

      const isValid = await sut.verify({
        password: "invalid_password",
        passwordHash: "valid_hash",
      });

      expect(isValid).toBe(false);
    });

    test("should throw if verification fails", async () => {
      jest
        .spyOn(argon2, "verify")
        .mockRejectedValue(new Error("Erro ao verificar senha"));

      await expect(
        sut.verify({
          password: "any_password",
          passwordHash: "any_hash",
        })
      ).rejects.toThrow("Erro ao verificar senha");
    });
  });
});
