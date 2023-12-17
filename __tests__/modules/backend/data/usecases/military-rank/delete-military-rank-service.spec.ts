import { AdaptMongoIdValidator } from "@/modules/backend/application/adapters/adapt-mongo-id-validator";
import {
  InvalidParamError,
  MissingParamError,
} from "@/modules/backend/data/errors";
import { NotRegisteredError } from "@/modules/backend/data/errors/not-registered-error";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { DeleteMilitaryRankService } from "@/modules/backend/data/usecases/military-rank/delete-military-rank-service";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { ObjectId } from "mongodb";

interface SutResponse {
  militaryRankRepository: MilitaryRankRepository;
  sut: DeleteMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const idValidator = new AdaptMongoIdValidator();
  const sut = new DeleteMilitaryRankService(
    militaryRankRepository,
    idValidator
  );

  return { militaryRankRepository, sut };
};

describe("DeleteMilitaryRankService", () => {
  test("should be throws if no id is provided", async () => {
    const { sut } = makeSut();

    await expect(sut.delete("")).rejects.toThrow(new MissingParamError("id"));
  });
  test("should be throws if invalid id is provided", async () => {
    const { sut } = makeSut();

    await expect(sut.delete("invalid_id")).rejects.toThrow(
      new InvalidParamError("id")
    );
  });
  test("should be throws if no registered id is provided", async () => {
    const { sut } = makeSut();
    const noRegisteredId = new ObjectId().toString();

    await expect(sut.delete(noRegisteredId)).rejects.toThrow(
      new NotRegisteredError("posto/graduação")
    );
  });
  test("should be delete a military rank if correct and registered id is provided", async () => {
    const { militaryRankRepository, sut } = makeSut();

    const militaryRank = await militaryRankRepository.add({
      order: 1,
      name: "any_military_rank",
    });

    await expect(sut.delete(militaryRank.id)).resolves.toEqual(militaryRank);
  });
});
