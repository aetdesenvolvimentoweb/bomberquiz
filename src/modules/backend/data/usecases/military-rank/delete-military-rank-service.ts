import { DeleteMilitaryRankUsecase } from "@/modules/backend/domain/usecases/delete-military-rank-usecase";
import { MilitaryRankRepository } from "../../protocols/repositories";
import { IdValidation } from "@/modules/backend/domain/validations";
import { MilitaryRankModel } from "@/modules/backend/domain/models";
import { DeleteMilitaryRankValidation } from "./delete-military-rank-validation";

export class DeleteMilitaryRankService implements DeleteMilitaryRankUsecase {
  private readonly deleteMilitaryRankValidation: DeleteMilitaryRankValidation;

  constructor(
    private readonly militaryRankRepository: MilitaryRankRepository,
    private idValidator: IdValidation
  ) {
    this.deleteMilitaryRankValidation = new DeleteMilitaryRankValidation(
      militaryRankRepository,
      this.idValidator
    );
  }

  delete = async (id: string): Promise<MilitaryRankModel> => {
    await this.deleteMilitaryRankValidation.checkMissingParams(id);
    this.deleteMilitaryRankValidation.isValid(id);
    await this.deleteMilitaryRankValidation.isRegistered(id);

    return await this.militaryRankRepository.delete(id);
  };
}
