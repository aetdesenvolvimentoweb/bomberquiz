import { GetByIdMilitaryRankUsecase } from "@/modules/backend/domain/usecases";
import { MilitaryRankRepository } from "../../protocols/repositories";
import { MilitaryRankModel } from "@/modules/backend/domain/models";
import { IdValidation } from "@/modules/backend/domain/validations";

export class GetByIdMilitaryRankService implements GetByIdMilitaryRankUsecase {
  constructor(
    private readonly militaryRankRepository: MilitaryRankRepository,
    private readonly idValidator: IdValidation
  ) {}

  getById = async (id: string): Promise<MilitaryRankModel | null> => {
    this.idValidator.isValid(id);
    return await this.militaryRankRepository.getById(id);
  };
}
