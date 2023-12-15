import { GetAllMilitaryRankUsecase } from "@/modules/backend/domain/usecases";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import { MilitaryRankModel } from "@/modules/backend/domain/models";

export class GetAllMilitaryRankService implements GetAllMilitaryRankUsecase {
  constructor(
    private readonly militaryRankRepository: MilitaryRankRepository
  ) {}

  getAll = async (): Promise<MilitaryRankModel[]> => {
    return await this.militaryRankRepository.getAll();
  };
}
