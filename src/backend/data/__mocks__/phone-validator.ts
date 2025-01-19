/* eslint-disable @typescript-eslint/no-unused-vars */
import { PhoneValidatorUseCase } from "@/backend/domain/use-cases/validators";

export class PhoneValidatorStub implements PhoneValidatorUseCase {
  public readonly isValid = (phone: string): boolean => {
    return true;
  };
}
