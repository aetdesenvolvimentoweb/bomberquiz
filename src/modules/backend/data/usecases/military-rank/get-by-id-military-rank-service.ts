import { GetByIdMilitaryRankUsecase } from "@/modules/backend/domain/usecases";
import { MilitaryRankRepository } from "../../protocols/repositories";
import { MilitaryRankModel } from "@/modules/backend/domain/models";
import { GetByIdMilitaryRankValidation } from ".";

export class GetByIdMilitaryRankService implements GetByIdMilitaryRankUsecase {
  private readonly getByIdMilitaryRankValidation: GetByIdMilitaryRankValidation;

  constructor(private readonly militaryRankRepository: MilitaryRankRepository) {
    this.getByIdMilitaryRankValidation = new GetByIdMilitaryRankValidation(
      militaryRankRepository
    );
  }

  getById = async (id: string): Promise<MilitaryRankModel | null> => {
    await this.getByIdMilitaryRankValidation.checkIsValidKey(id);
    return await this.militaryRankRepository.getById(id);
  };
}
