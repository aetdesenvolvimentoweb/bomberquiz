import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";

export const makeAddMilitaryRankService = (): AddMilitaryRankService => {
  const militaryRankInMemoryRepository = new MilitaryRankInMemoryRepository();
  return new AddMilitaryRankService(militaryRankInMemoryRepository);
};
