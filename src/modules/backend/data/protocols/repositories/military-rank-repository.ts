import {
  AddMilitaryRankModel,
  MilitaryRankModel,
} from "@/modules/backend/domain/models";

export interface MilitaryRankRepository {
  add: (data: AddMilitaryRankModel) => Promise<MilitaryRankModel>;
  getByName: (name: string) => Promise<MilitaryRankModel | null>;
}
