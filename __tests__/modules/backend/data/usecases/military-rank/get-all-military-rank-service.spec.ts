import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { GetAllMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";

interface SutResponse {
  militaryRankRepository: MilitaryRankRepository;
  sut: GetAllMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const sut = new GetAllMilitaryRankService(militaryRankRepository);

  return { militaryRankRepository, sut };
};

describe("GetAllMilitaryRankService", () => {
  test("should be return an array of military rank from db that found", async () => {
    const { militaryRankRepository, sut } = makeSut();

    await militaryRankRepository.add({ order: 1, name: "any_military_rank" });

    const militaryRanks = await sut.getAll();

    expect(Array.isArray(militaryRanks)).toBe(true);
    expect(militaryRanks.length).toBeGreaterThan(0);
    expect(militaryRanks[0]).toHaveProperty("id");
    expect(militaryRanks[0]).toHaveProperty("order");
    expect(militaryRanks[0]).toHaveProperty("name");
  });
});
