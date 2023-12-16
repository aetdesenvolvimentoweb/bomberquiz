import { GetByIdMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";
import { Controller } from "@/modules/backend/presentation/protocols";
import { makeGetByIdMilitaryRankService } from "../usecases/get-by-id-military-rank-service-factory";

export const makeGetByIdMilitaryRankController = (): Controller =>
  new GetByIdMilitaryRankController(makeGetByIdMilitaryRankService());
