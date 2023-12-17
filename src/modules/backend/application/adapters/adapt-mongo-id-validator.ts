import { ObjectId } from "mongodb";
import { IdValidation } from "../../domain/validations";
import { InvalidParamError } from "../../data/errors";

export class AdaptMongoIdValidator implements IdValidation {
  isValid = (id: string): boolean => {
    console.log("adapter check id", id);
    if (!ObjectId.isValid(id)) {
      console.log("id inválido");
      throw new InvalidParamError("id");
    }
    return true;
  };
}
