import { Argon2EncrypterAdapter } from "../argon2.encrypter.adapter";
import { EncrypterUseCase } from "@/backend/domain/use-cases";

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

  beforeAll(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa a criptografia de senha
   */
  describe("encrypt", () => {
    test("should encrypt password and generate valid hash", async () => {
      const password = "valid_password";
      const hash = await sut.encrypt(password);

      expect(hash).toBeTruthy();
      expect(hash).not.toBe(password);
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
    });

    test("should generate different hashes for same password", async () => {
      const password = "valid_password";
      const hash1 = await sut.encrypt(password);
      const hash2 = await sut.encrypt(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  /**
   * Testa a verificação de senha
   */
  describe("verify", () => {
    test("should verify password against its hash correctly", async () => {
      const password = "valid_password";
      const hash = await sut.encrypt(password);

      const isValid = await sut.verify({
        password,
        passwordHash: hash,
      });

      expect(isValid).toBe(true);
    });

    test("should return false for incorrect password", async () => {
      const password = "valid_password";
      const hash = await sut.encrypt(password);

      const isValid = await sut.verify({
        password: "wrong_password",
        passwordHash: hash,
      });

      expect(isValid).toBe(false);
    });

    test("should return false for invalid hash format", async () => {
      const password = "valid_password";
      const hash = await sut.encrypt(password);

      const isValid = await sut.verify({
        password: "any_password",
        passwordHash: hash,
      });

      expect(isValid).toBe(false);
    });
  });
});
