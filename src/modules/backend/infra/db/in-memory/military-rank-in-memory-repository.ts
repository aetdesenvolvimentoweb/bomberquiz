import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import {
  AddMilitaryRankModel,
  MilitaryRankModel,
} from "@/modules/backend/domain/models";
import { randomUUID } from "crypto";

export class MilitaryRankInMemoryRepository implements MilitaryRankRepository {
  private readonly militaryRanks: MilitaryRankModel[];

  constructor() {
    this.militaryRanks = [];
  }

  add = async (data: AddMilitaryRankModel): Promise<MilitaryRankModel> => {
    const militaryRank = { ...data, id: randomUUID() };
    this.militaryRanks.push(militaryRank);
    return militaryRank;
  };

  getByName = async (name: string): Promise<MilitaryRankModel | null> => {
    const militaryRank = this.militaryRanks.find((rank) => rank.name === name);
    return militaryRank || null;
  };
}
