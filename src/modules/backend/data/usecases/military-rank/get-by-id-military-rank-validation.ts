import { IdValidation } from "@/modules/backend/domain/validations";

export class GetByIdMilitaryRankValidation implements IdValidation {
  constructor(private readonly idValidator: IdValidation) {}

  isValid = (id: string): boolean => {
    if (!this.idValidator.isValid(id)) {
      return false;
    }
    return true;
  };
}
