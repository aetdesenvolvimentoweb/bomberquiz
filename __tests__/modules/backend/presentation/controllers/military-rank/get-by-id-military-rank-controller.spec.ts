import { AdaptMongoIdValidator } from "@/modules/backend/application/adapters/adapt-mongo-id-validator";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { GetByIdMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { GetByIdMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";

interface SutResponse {
  militaryRankRepository: MilitaryRankRepository;
  sut: GetByIdMilitaryRankController;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const idValidator = new AdaptMongoIdValidator();
  const getByIdMilitaryRankService = new GetByIdMilitaryRankService(
    militaryRankRepository,
    idValidator
  );
  const sut = new GetByIdMilitaryRankController(getByIdMilitaryRankService);
  return { militaryRankRepository, sut };
};

describe("GetByIdMilitaryRankController", () => {
  test("should be return 200 if correct data is provided", async () => {
    const { militaryRankRepository, sut } = makeSut();

    const militaryRank = await militaryRankRepository.add({
      order: 1,
      name: "any_military_rank",
    });

    const httpResponse = await sut.handle(militaryRank.id);

    expect(httpResponse.statusCode).toBe(200);
  });
});
