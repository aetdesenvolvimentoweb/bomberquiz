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
   * Testa as operações reais no banco de dados
   */
  describe("database operations", () => {
    test("should connect and query database successfully", async () => {
      await sut.$connect();
      const users = await sut.user.findMany();
      expect(Array.isArray(users)).toBe(true);
    });

    test("should handle transaction successfully", async () => {
      const result = await sut.$transaction(async (tx) => {
        return await tx.user.findMany();
      });
      expect(Array.isArray(result)).toBe(true);
    });
  });

  afterAll(async () => {
    await sut.$disconnect();
  });
});
