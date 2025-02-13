import { UserPhoneValidatorUseCase } from "@/backend/domain/use-cases";
import { isValidPhoneNumber } from "libphonenumber-js/max";

export class LibPhoneNumberJsPhoneValidatorAdapter
  implements UserPhoneValidatorUseCase
{
  public readonly isValid = (phone: string): boolean => {
    return isValidPhoneNumber(phone);
  };
}
