import { IdValidation } from "@/modules/backend/domain/validations";
import { InvalidParamError } from "../../errors";

export class GetByIdMilitaryRankValidation implements IdValidation {
  constructor(private readonly idValidator: IdValidation) {}

  isValid = (id: string): boolean => {
    if (!this.idValidator.isValid(id)) {
      throw new InvalidParamError("id");
    }
    return true;
  };
}
