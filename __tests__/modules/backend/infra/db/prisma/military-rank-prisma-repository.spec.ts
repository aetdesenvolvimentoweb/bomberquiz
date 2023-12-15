import { MilitaryRankPrismaRepository } from "@/modules/backend/infra/db/prisma";
import { prismaClient } from "@/modules/backend/infra/libs";

interface SutResponse {
  sut: MilitaryRankPrismaRepository;
}

const makeSut = (): SutResponse => {
  const sut = new MilitaryRankPrismaRepository();
  return { sut };
};

describe("MilitaryRankPrismaRepository", () => {
  afterEach(async () => {
    await prismaClient.militaryRank.deleteMany({});
  });

  test("should be create a military rank in db if correct data is provided", async () => {
    const { sut } = makeSut();

    const militaryRank = await sut.add({ order: 1, name: "any_military_rank" });

    expect(militaryRank).toHaveProperty("id");
    expect(militaryRank.order).toBe(1);
    expect(militaryRank.name).toBe("any_military_rank");
  });
});
