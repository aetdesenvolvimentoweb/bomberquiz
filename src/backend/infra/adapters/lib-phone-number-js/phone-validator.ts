import { PhoneValidatorUseCase } from "@/backend/domain/use-cases";
import { isValidPhoneNumber } from "libphonenumber-js/max";

export class LibPhoneNumberJsPhoneValidatorAdapter
  implements PhoneValidatorUseCase
{
  public readonly isValid = (phone: string): boolean => {
    return isValidPhoneNumber(phone);
  };
}
