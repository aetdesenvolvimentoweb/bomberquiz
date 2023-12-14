import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRanksInMemoryRepository } from "@/modules/backend/infra/db/in-memory";

interface SutResponse {
  sut: AddMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRanksInMemoryRepository();
  const sut = new AddMilitaryRankService(militaryRankRepository);

  return { sut };
};

describe("AddMilitaryRankService", () => {
  test("should be add a military rank in db", async () => {
    const { sut } = makeSut();

    await expect(
      sut.add({ order: 1, name: "any_military_rank" })
    ).resolves.not.toThrow();
  });
});
