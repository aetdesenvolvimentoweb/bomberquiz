import { AddMilitaryRankModel } from "@/modules/backend/domain/models";
import { AddMilitaryRankUsecase } from "@/modules/backend/domain/usecases";
import { AddMilitaryRankValidation } from ".";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";

export class AddMilitaryRankService implements AddMilitaryRankUsecase {
  private readonly addMilitaryRankValidation: AddMilitaryRankValidation;

  constructor(private readonly militaryRankRepository: MilitaryRankRepository) {
    this.addMilitaryRankValidation = new AddMilitaryRankValidation(
      militaryRankRepository
    );
  }

  add = async (data: AddMilitaryRankModel): Promise<void> => {
    await this.addMilitaryRankValidation.checkMissingParams(data);
    await this.addMilitaryRankValidation.checkDuplicatedKey(data.name);
    await this.militaryRankRepository.add(data);
  };
}
