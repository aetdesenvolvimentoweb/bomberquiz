import { GetAllMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";
import { Controller } from "@/modules/backend/presentation/protocols";
import { makeGetAllMilitaryRankService } from "@/modules/backend/application/factories/usecases";

export const makeGetAllMilitaryRankController = (): Controller =>
  new GetAllMilitaryRankController(makeGetAllMilitaryRankService());
