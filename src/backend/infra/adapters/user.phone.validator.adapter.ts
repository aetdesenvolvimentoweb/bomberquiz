import { CountryCode, PhoneNumber } from "libphonenumber-js/min";

import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { UserPhoneValidatorUseCase } from "@/backend/domain/validators";

export class UserPhoneValidatorAdapter implements UserPhoneValidatorUseCase {
  private parsePhoneNumberFunction:
    | ((
        text: string,
        defaultCountry?:
          | CountryCode
          | {
              defaultCountry?: CountryCode;
              defaultCallingCode?: string;
              extract?: boolean;
            },
      ) => PhoneNumber)
    | null = null;

  private readonly getValidator = async (): Promise<
    (
      text: string,
      defaultCountry?:
        | CountryCode
        | {
            defaultCountry?: CountryCode;
            defaultCallingCode?: string;
            extract?: boolean;
          },
    ) => PhoneNumber
  > => {
    if (this.parsePhoneNumberFunction) {
      return this.parsePhoneNumberFunction;
    }
    try {
      const libphonenumber = await import("libphonenumber-js/min");
      this.parsePhoneNumberFunction = libphonenumber.parsePhoneNumber;
      return this.parsePhoneNumberFunction;
    } catch (error: unknown) {
      throw new ServerError(error as Error);
    }
  };

  public readonly validate = async (phone: string): Promise<void> => {
    const parsePhoneNumberFunction = await this.getValidator();
    const phoneNumber = parsePhoneNumberFunction(phone, "BR");
    if (!phoneNumber.isValid()) {
      throw new InvalidParamError("telefone");
    }
  };
}
