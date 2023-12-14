import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRanksInMemoryRepository } from "@/modules/backend/infra/db/in-memory";

export const makeAddMilitaryRankService = (): AddMilitaryRankService => {
  const militaryRankInMemoryRepository = new MilitaryRanksInMemoryRepository();
  return new AddMilitaryRankService(militaryRankInMemoryRepository);
};
