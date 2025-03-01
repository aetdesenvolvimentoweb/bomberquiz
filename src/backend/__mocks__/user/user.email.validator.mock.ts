/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserEmailValidatorUseCase } from "../../domain/validators";

export class UserEmailValidatorMock implements UserEmailValidatorUseCase {
  public readonly validate = (email: string): Promise<void> => {
    return new Promise((resolve) => undefined);
  };
}
