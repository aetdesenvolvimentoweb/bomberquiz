import { MilitaryRankModel } from "@/modules/backend/domain/models";

export interface GetAllMilitaryRankUsecase {
  getAll: () => Promise<MilitaryRankModel[]>;
}
