import { EmailValidatorUseCase } from "@/backend/domain/use-cases";
import isEmail from "validator/lib/isEmail";

export class ValidatorJsEmailValidatorAdapter implements EmailValidatorUseCase {
  public readonly isValid = (email: string): boolean => {
    return isEmail(email);
  };
}
