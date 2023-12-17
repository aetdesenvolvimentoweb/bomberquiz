import { MilitaryRankModel } from "@/modules/backend/domain/models";

export interface DeleteMilitaryRankUsecase {
  delete: (id: string) => Promise<MilitaryRankModel>;
}
