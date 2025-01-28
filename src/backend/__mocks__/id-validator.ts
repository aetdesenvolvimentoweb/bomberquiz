/* eslint-disable @typescript-eslint/no-unused-vars */
import { IdValidatorUseCase } from "@/backend/domain/use-cases";

export class IdValidatorStub implements IdValidatorUseCase {
  public readonly isValid = (id: string): boolean => {
    return true;
  };
}
