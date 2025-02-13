import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../prisma.client.adapter";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: PrismaClient;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const sut = prismaClient;
  return { sut };
};

describe("PrismaClientAdapter", () => {
  let sut: PrismaClient;

  beforeAll(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa o padrão singleton
   */
  describe("singleton", () => {
    test("should return same instance when called multiple times", () => {
      const instance1 = sut;
      const instance2 = sut;

      expect(instance1).toBe(instance2);
    });
  });

  /**
   * Testa a conexão com o banco
   */
  describe("connection", () => {
    test("should connect successfully", async () => {
      await expect(sut.$connect()).resolves.not.toThrow();
    });

    test("should disconnect successfully", async () => {
      await expect(sut.$disconnect()).resolves.not.toThrow();
    });
  });
});
