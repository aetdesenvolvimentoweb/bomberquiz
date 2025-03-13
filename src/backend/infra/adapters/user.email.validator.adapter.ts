import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { UserEmailValidatorUseCase } from "@/backend/domain/validators";

export class UserEmailValidatorAdapter implements UserEmailValidatorUseCase {
  private isEmailFunction: ((email: string) => boolean) | null = null;

  private readonly getValidator = async (): Promise<
    (email: string) => boolean
  > => {
    if (this.isEmailFunction) {
      return this.isEmailFunction;
    }
    try {
      const validator = await import("validator");
      this.isEmailFunction = validator.isEmail;
      return this.isEmailFunction;
    } catch (error: unknown) {
      throw new ServerError(error as Error);
    }
  };

  public readonly validate = async (email: string): Promise<void> => {
    const isEmail = await this.getValidator();
    if (!isEmail(email)) {
      throw new InvalidParamError("email");
    }
  };
}
