import {
  AddMilitaryRankModel,
  MilitaryRankModel,
} from "@/modules/backend/domain/models";

export interface MilitaryRankRepository {
  add: (data: AddMilitaryRankModel) => Promise<MilitaryRankModel>;
  getAll: () => Promise<MilitaryRankModel[]>;
  getById: (id: string) => Promise<MilitaryRankModel | null>;
  getByName: (name: string) => Promise<MilitaryRankModel | null>;
}
