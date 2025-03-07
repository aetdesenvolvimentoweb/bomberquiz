import { DuplicateResourceError } from "@/backend/domain/erros";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

export class UserUniqueEmailValidator
  implements UserUniqueEmailValidatorUseCase
{
  constructor(private readonly userRepository: UserRepository) {}

  public readonly validate = async (email: string): Promise<void> => {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new DuplicateResourceError("Email");
    }
  };
}
