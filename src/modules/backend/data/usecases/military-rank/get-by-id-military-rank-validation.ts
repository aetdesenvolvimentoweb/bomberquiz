import { IdValidation } from "@/modules/backend/domain/validations";
import { InvalidParamError } from "@/modules/backend/presentation/errors/invalid-param-error";

export class GetByIdMilitaryRankValidation implements IdValidation {
  constructor(private readonly idValidator: IdValidation) {}

  checkIdIsValid = (id: string): boolean => {
    if (!this.idValidator.checkIdIsValid(id)) {
      throw new InvalidParamError("id");
    }
    return true;
  };
}
