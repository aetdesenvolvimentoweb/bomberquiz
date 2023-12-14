export interface AddMilitaryRankModel {
  order: number;
  name: string;
}

export interface MilitaryRankModel extends AddMilitaryRankModel {
  id: string;
}
