import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

export class UserUniqueEmailValidator
  implements UserUniqueEmailValidatorUseCase
{
  constructor(private readonly repository: UserRepository) {}

  public readonly validate = async (data: {
    id?: string;
    email: string;
  }): Promise<void> => {
    const user = await this.repository.findByEmail(data.email);

    if (user) {
      throw new DuplicateResourceError("Email");
    }
  };
}
