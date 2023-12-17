import { ObjectId } from "mongodb";
import { IdValidation } from "../../domain/validations";
import { InvalidParamError } from "../../data/errors";

export class AdaptMongoIdValidator implements IdValidation {
  isValid = (id: string): boolean => {
    if (!ObjectId.isValid(id)) {
      throw new InvalidParamError("id");
    }
    return true;
  };
}
