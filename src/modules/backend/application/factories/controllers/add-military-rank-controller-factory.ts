import { AddMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";
import { Controller } from "@/modules/backend/presentation/protocols";
import { makeAddMilitaryRankService } from "@/modules/backend/application/factories/usecases";

export const makeAddMilitaryRankController = (): Controller =>
  new AddMilitaryRankController(makeAddMilitaryRankService());
