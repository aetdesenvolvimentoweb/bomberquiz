/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserPhoneValidatorUseCase } from "@/backend/domain/use-cases";

export class PhoneValidatorStub implements UserPhoneValidatorUseCase {
  public readonly isValid = (phone: string): boolean => {
    return true;
  };
}
