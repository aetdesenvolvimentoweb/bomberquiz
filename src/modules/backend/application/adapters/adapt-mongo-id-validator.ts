import { ObjectId } from "mongodb";
import { IdValidation } from "../../domain/validations";
import { InvalidParamError } from "../../data/errors";

export class AdaptMongoIdValidator implements IdValidation {
  isValid = (id: string): boolean => {
    console.log("dentro do is valid", id);
    if (!ObjectId.isValid(id)) {
      console.log("dentro do erro");

      throw new InvalidParamError("id");
    }
    return true;
  };
}
