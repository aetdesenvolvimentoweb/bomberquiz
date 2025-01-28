/* eslint-disable @typescript-eslint/no-unused-vars */
import { EmailValidatorUseCase } from "@/backend/domain/use-cases";

export class EmailValidatorStub implements EmailValidatorUseCase {
  public readonly isValid = (email: string): boolean => {
    return true;
  };
}
