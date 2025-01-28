/* eslint-disable @typescript-eslint/no-unused-vars */
import { PhoneValidatorUseCase } from "@/backend/domain/use-cases";

export class PhoneValidatorStub implements PhoneValidatorUseCase {
  public readonly isValid = (phone: string): boolean => {
    return true;
  };
}
