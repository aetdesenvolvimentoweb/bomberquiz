import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import {
  AddMilitaryRankModel,
  MilitaryRankModel,
} from "@/modules/backend/domain/models";
import { ObjectId } from "mongodb";

export class MilitaryRankInMemoryRepository implements MilitaryRankRepository {
  private readonly militaryRanks: MilitaryRankModel[];

  constructor() {
    this.militaryRanks = [];
  }

  add = async (data: AddMilitaryRankModel): Promise<MilitaryRankModel> => {
    const militaryRank = { ...data, id: new ObjectId().toString() };
    this.militaryRanks.push(militaryRank);
    return militaryRank;
  };

  getAll = async (): Promise<MilitaryRankModel[]> => {
    return this.militaryRanks;
  };

  getById = async (id: string): Promise<MilitaryRankModel | null> => {
    return this.militaryRanks.find((rank) => rank.id === id) || null;
  };

  getByName = async (name: string): Promise<MilitaryRankModel | null> => {
    const militaryRank = this.militaryRanks.find((rank) => rank.name === name);
    return militaryRank || null;
  };
}
