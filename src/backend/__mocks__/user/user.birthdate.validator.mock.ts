/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserBirthdateValidatorUseCase } from "../../domain/validators";

export class UserBirthdateValidatorMock
  implements UserBirthdateValidatorUseCase
{
  public readonly validate = (birthdate: Date): void => {
    return undefined;
  };
}
