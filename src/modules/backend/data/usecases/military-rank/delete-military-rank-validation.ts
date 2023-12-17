import {
  IdValidation,
  MissingParamValidation,
} from "@/modules/backend/domain/validations";
import { InvalidParamError, MissingParamError } from "../../errors";
import { MilitaryRankRepository } from "../../protocols/repositories";
import { RegisteredValidation } from "@/modules/backend/domain/validations/registered-validation";
import { NotRegisteredError } from "../../errors/not-registered-error";

export class DeleteMilitaryRankValidation
  implements MissingParamValidation, IdValidation, RegisteredValidation
{
  constructor(
    private readonly militaryRankRepository: MilitaryRankRepository,
    private readonly idValidator: IdValidation
  ) {}

  checkMissingParams = async (data: string): Promise<void> => {
    if (!data) {
      throw new MissingParamError("id");
    }
  };

  isValid = (id: string): boolean => {
    if (!this.idValidator.isValid(id)) {
      throw new InvalidParamError("id");
    }
    return true;
  };

  isRegistered = async (id: string): Promise<boolean> => {
    const isRegistered = await this.militaryRankRepository.getById(id);
    if (!isRegistered) {
      throw new NotRegisteredError("posto/graduação");
    }
    return true;
  };
}
