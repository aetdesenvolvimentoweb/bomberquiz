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

  test("should be return a military rank from db if found", async () => {
    const { sut } = makeSut();

    await sut.add({ order: 1, name: "any_military_rank" });
    const militaryRank = await sut.getByName("any_military_rank");

    expect(militaryRank).toHaveProperty("id");
    expect(militaryRank?.order).toBe(1);
    expect(militaryRank?.name).toBe("any_military_rank");
  });

  test("should be return null if military rank not found", async () => {
    const { sut } = makeSut();

    const militaryRank = await sut.getByName("no_registered_military_rank");

    expect(militaryRank).toBeNull();
  });

  test("should be return an array of military rank from db if that found", async () => {
    const { sut } = makeSut();

    await sut.add({ order: 1, name: "any_military_rank" });
    const militaryRanks = await sut.getAll();

    expect(Array.isArray(militaryRanks)).toBe(true);
    expect(militaryRanks.length).toBeGreaterThan(0);
    expect(militaryRanks[0]).toHaveProperty("id");
    expect(militaryRanks[0]).toHaveProperty("order");
    expect(militaryRanks[0]).toHaveProperty("name");
  });

  test("should be return a military rank from db if that found", async () => {
    const { sut } = makeSut();

    const militaryRankCreated = await sut.add({
      order: 1,
      name: "any_military_rank",
    });

    const militaryRank = await sut.getById(militaryRankCreated.id);

    expect(militaryRank).toEqual(militaryRankCreated);
  });
});
