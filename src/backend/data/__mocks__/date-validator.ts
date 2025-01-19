/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateValidatorUseCase } from "@/backend/domain/use-cases/validators";

export class DateValidatorStub implements DateValidatorUseCase {
  public readonly isValid = (date: Date): boolean => {
    return true;
  };
}
