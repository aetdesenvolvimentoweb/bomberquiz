import { AdaptMongoIdValidator } from "@/modules/backend/application/adapters/adapt-mongo-id-validator";
import { InvalidParamError } from "@/modules/backend/data/errors";
import {
  GetByIdMilitaryRankService,
  GetByIdMilitaryRankValidation,
} from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { ObjectId } from "mongodb";

interface SutResponse {
  sut: GetByIdMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const idValidator = new AdaptMongoIdValidator();
  const getByIdMilitaryRankValidation = new GetByIdMilitaryRankValidation(
    idValidator
  );
  const sut = new GetByIdMilitaryRankService(
    militaryRankRepository,
    idValidator
  );

  return { sut };
};

describe("GetByIdMilitaryRankService", () => {
  test("should be return 400 if invalid id is provided", async () => {
    const { sut } = makeSut();

    await expect(sut.getById("invalid_id")).rejects.toThrow(
      new InvalidParamError("id")
    );
  });
});
