import { IdValidation } from "@/modules/backend/domain/validations";

export class GetByIdMilitaryRankValidation implements IdValidation {
  constructor(private readonly idValidator: IdValidation) {}

  checkIdIsValid = (id: string): boolean => {
    if (this.idValidator.checkIdIsValid(id)) {
      return true;
    }
    return false;
  };
}
