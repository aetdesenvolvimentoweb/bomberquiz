import { IdValidation } from "@/modules/backend/domain/validations";
import { InvalidParamError } from "../../errors";

export class GetByIdMilitaryRankValidation implements IdValidation {
  isValid = (id: string): boolean => {
    if (!this.isValid(id)) {
      throw new InvalidParamError("id");
    }
    return true;
  };
}
