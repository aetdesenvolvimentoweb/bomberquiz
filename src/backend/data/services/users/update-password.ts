/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UpdateUserPasswordUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";

interface UpdateUserPasswordServiceProps {
  userRepository: UserRepository;
  userIdValidator: UserIdValidatorUseCase;
}

export class UpdateUserPasswordService implements UpdateUserPasswordUseCase {
  constructor(private props: UpdateUserPasswordServiceProps) {}

  public readonly updatePassword = async ({
    id,
    oldPassword,
    newPassword,
  }: UpdateUserPasswordProps): Promise<void> => {
    const { userRepository } = this.props;

    await userRepository.delete(id);
  };
}
