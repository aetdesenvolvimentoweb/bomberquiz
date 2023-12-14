import { AddMilitaryRankModel } from "@/modules/backend/domain/models";

export interface AddMilitaryRankUsecase {
  add: (data: AddMilitaryRankModel) => Promise<void>;
}
