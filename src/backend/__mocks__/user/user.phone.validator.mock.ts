/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserPhoneValidatorUseCase } from "../../domain/validators";

export class UserPhoneValidatorMock implements UserPhoneValidatorUseCase {
  public readonly validate = (phone: string): void => {
    return undefined;
  };
}
