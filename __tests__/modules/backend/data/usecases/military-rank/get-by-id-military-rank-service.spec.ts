import { AdaptMongoIdValidator } from "@/modules/backend/application/adapters/adapt-mongo-id-validator";
import { InvalidParamError } from "@/modules/backend/data/errors";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { GetByIdMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { ObjectId } from "mongodb";

interface SutResponse {
  militaryRankRepository: MilitaryRankRepository;
  sut: GetByIdMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const idValidator = new AdaptMongoIdValidator();
  const sut = new GetByIdMilitaryRankService(
    militaryRankRepository,
    idValidator
  );

  return { militaryRankRepository, sut };
};

describe("GetByIdMilitaryRankService", () => {
  test("should be throws if invalid id is provided", async () => {
    const { sut } = makeSut();

    await expect(sut.getById("invalid_id")).rejects.toThrow(
      new InvalidParamError("id")
    );
  });
  test("should be return null if no registered id is provided", async () => {
    const { sut } = makeSut();

    const no_registered_id = new ObjectId().toString();

    await expect(sut.getById(no_registered_id)).resolves.toBeNull();
  });
  test("should be return a military rank if correct and registered id is provided", async () => {
    const { militaryRankRepository, sut } = makeSut();

    const militaryRank = await militaryRankRepository.add({
      order: 1,
      name: "any_military_rank",
    });

    await expect(sut.getById(militaryRank.id)).resolves.toEqual(militaryRank);
  });
});
