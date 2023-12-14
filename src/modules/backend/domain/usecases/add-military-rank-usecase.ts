import { AddMilitaryRankModel, MilitaryRankModel } from "../models";

export interface AddMilitaryRankUsecase {
  add: (data: AddMilitaryRankModel) => Promise<MilitaryRankModel>;
}
