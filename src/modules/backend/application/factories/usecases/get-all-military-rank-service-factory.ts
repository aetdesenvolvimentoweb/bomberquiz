import { GetAllMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";

export const makeGetAllMilitaryRankService = (): GetAllMilitaryRankService => {
  const militaryRankInMemoryRepository = new MilitaryRankInMemoryRepository();
  return new GetAllMilitaryRankService(militaryRankInMemoryRepository);
};
