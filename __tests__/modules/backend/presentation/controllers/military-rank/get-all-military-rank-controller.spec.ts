import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { GetAllMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { GetAllMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";

interface SutResponse {
  militaryRankRepository: MilitaryRankRepository;
  sut: GetAllMilitaryRankController;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const getAllMilitaryRankService = new GetAllMilitaryRankService(
    militaryRankRepository
  );
  const sut = new GetAllMilitaryRankController(getAllMilitaryRankService);
  return { militaryRankRepository, sut };
};

describe("GetAllMilitaryRankController", () => {
  test("should be return 200 if military ranks is that found", async () => {
    const { militaryRankRepository, sut } = makeSut();

    await militaryRankRepository.add({
      order: 1,
      name: "any_military_rank",
    });

    const httpResponse = await sut.handle();

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse).toHaveProperty("data");
    expect(Array.isArray(httpResponse.data)).toBe(true);
    expect(httpResponse.data[0]).toHaveProperty("id");
    expect(httpResponse.data[0]).toHaveProperty("order");
    expect(httpResponse.data[0]).toHaveProperty("name");
  });
});
