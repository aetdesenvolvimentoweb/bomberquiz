import {
  EncrypterUseCase,
  UpdatePasswordPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "../../repositories";
import { ValidationErrors } from "../../helpers";

interface ConstructorProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

export class UpdatePasswordPropsValidator
  implements UpdatePasswordPropsValidatorUseCase
{
  private encrypter;
  private userRepository;
  private validationErrors;

  constructor(private props: ConstructorProps) {
    this.encrypter = props.encrypter;
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

  private checkMatchingPassword = async (
    id: string,
    password: string
  ): Promise<void> => {
    const userMapped = await this.userRepository.listById(id);
    const user = await this.userRepository.listByEmail(userMapped!.email);
    if (!(await this.encrypter.verify(password, user!.password))) {
      throw this.validationErrors.wrongPasswordError("senha atual");
    }
  };

  public readonly validateUpdatePasswordProps =
    async (updateUserPasswordProps: {
      id: string;
      props: UpdateUserPasswordProps;
    }): Promise<void> => {
      const { id, props } = updateUserPasswordProps;

      this.checkMissingUpdatePasswordProps(props);
      this.validatePassword(props.oldPassword, "senha atual");
      await this.checkMatchingPassword(id, props.oldPassword);
      this.validatePassword(props.newPassword, "nova senha");
    };
}
