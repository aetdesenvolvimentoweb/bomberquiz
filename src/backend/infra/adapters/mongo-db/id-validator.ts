import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { ObjectId } from "mongodb";

export class MongoDBIdValidator implements IdValidatorUseCase {
  public readonly isValid = (id: string): boolean => {
    return ObjectId.isValid(id);
  };
}
