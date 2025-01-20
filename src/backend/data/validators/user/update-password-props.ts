import { UpdatePasswordPropsValidatorUseCase } from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface UpdatePasswordPropsValidatorDependencies {
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

export class UpdatePasswordPropsValidator
  implements UpdatePasswordPropsValidatorUseCase
{
  private userRepository;
  private validationErrors;

  constructor(private props: UpdatePasswordPropsValidatorDependencies) {
    this.userRepository = props.userRepository;
    this.validationErrors = props.validationErrors;
  }

  private checkMissingUpdatePasswordProps = (
    updateUserPasswordProps: Omit<UpdateUserPasswordProps, "id">
  ): void => {
    const fieldNames: {
      [key in keyof Omit<UpdateUserPasswordProps, "id">]: string;
    } = {
      oldPassword: "senha atual",
      newPassword: "nova senha",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (
        !updateUserPasswordProps[
          field as keyof Omit<UpdateUserPasswordProps, "id">
        ]
      ) {
        throw this.validationErrors.missingParamError(name);
      }
    });
  };

  private validatePassword = (password: string, passwordName: string): void => {
    if (password.length < 8) {
      throw this.validationErrors.invalidParamError(passwordName);
    }
  };

  public readonly validateUpdatePasswordProps = async (
    updateUserPasswordProps: Omit<UpdateUserPasswordProps, "id">
  ): Promise<void> => {
    this.checkMissingUpdatePasswordProps(updateUserPasswordProps);
    this.validatePassword(updateUserPasswordProps.oldPassword, "senha atual");
    this.validatePassword(updateUserPasswordProps.newPassword, "nova senha");
  };
}
