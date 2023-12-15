import { MilitaryRankModel } from "@/modules/backend/domain/models";

export interface GetByIdMilitaryRankUsecase {
  getById: (id: string) => Promise<MilitaryRankModel | null>;
}
