import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRanksInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { AddMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";

interface SutResponse {
  sut: AddMilitaryRankController;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRanksInMemoryRepository();
  const addMilitaryRankService = new AddMilitaryRankService(
    militaryRankRepository
  );
  const sut = new AddMilitaryRankController(addMilitaryRankService);
  return { sut };
};

describe("AddMilitaryRankController", () => {
  test("should be return 201 if correct data is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      order: 1,
      name: "any_military_rank",
    });

    expect(httpResponse.statusCode).toBe(201);
  });
});
