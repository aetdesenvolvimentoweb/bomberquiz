import { GetByIdMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { AdaptMongoIdValidator } from "../../adapters/adapt-mongo-id-validator";

export const makeGetByIdMilitaryRankService =
  (): GetByIdMilitaryRankService => {
    const militaryRankInMemoryRepository = new MilitaryRankInMemoryRepository();
    const idValidator = new AdaptMongoIdValidator();
    return new GetByIdMilitaryRankService(
      militaryRankInMemoryRepository,
      idValidator
    );
  };
