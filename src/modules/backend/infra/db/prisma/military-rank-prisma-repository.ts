import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import {
  AddMilitaryRankModel,
  MilitaryRankModel,
} from "@/modules/backend/domain/models";
import { prismaClient } from "@/modules/backend/infra/libs";

export class MilitaryRankPrismaRepository implements MilitaryRankRepository {
  add = async (data: AddMilitaryRankModel): Promise<MilitaryRankModel> => {
    return await prismaClient.militaryRank.create({ data });
  };

  getAll = async (): Promise<MilitaryRankModel[]> => {
    return await prismaClient.militaryRank.findMany({});
  };

  getById = async (id: string): Promise<MilitaryRankModel | null> => {
    return await prismaClient.militaryRank.findFirst({ where: { id } });
  };

  getByName = async (name: string): Promise<MilitaryRankModel | null> => {
    return await prismaClient.militaryRank.findUnique({ where: { name } });
  };
}
