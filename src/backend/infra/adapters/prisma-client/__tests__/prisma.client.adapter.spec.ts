import { prismaClient } from "../prisma.client.adapter";

describe("PrismaClientAdapter", () => {
  describe("singleton", () => {
    test("should return same instance when called multiple times", () => {
      const instance1 = prismaClient;
      const instance2 = prismaClient;

      expect(instance1).toBe(instance2);
    });
  });

  describe("connection", () => {
    test("should connect successfully", async () => {
      await expect(prismaClient.$connect()).resolves.not.toThrow();
    });

    test("should disconnect successfully", async () => {
      await expect(prismaClient.$disconnect()).resolves.not.toThrow();
    });
  });
});
