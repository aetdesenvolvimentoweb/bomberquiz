import {
  EncrypterUseCase,
  UserUpdatePasswordPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";

interface UpdatePasswordValidatorProps {
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Implementa a validação das propriedades de atualização de senha no sistema
 */
export class UserUpdatePasswordPropsValidator
  implements UserUpdatePasswordPropsValidatorUseCase
{
  private encrypter;
  private userRepository;
  private errorsValidation;

  constructor(private props: UpdatePasswordValidatorProps) {
    this.encrypter = props.encrypter;
    this.userRepository = props.userRepository;
    this.errorsValidation = props.errorsValidation;
  }

  /**
   * Verifica se as propriedades de atualização de senha estão preenchidas
   * @param updateUserPasswordProps Propriedades de senha a serem verificadas
   * @throws {ErrorApp} Quando alguma propriedade estiver ausente
   */
  private checkMissingUpdatePasswordProps = (
    updateUserPasswordProps: UpdateUserPasswordProps
  ): void => {
    const fieldNames: {
      [key in keyof UpdateUserPasswordProps]: string;
    } = {
      oldPassword: "senha atual",
      newPassword: "nova senha",
    };

    Object.entries(fieldNames).forEach(([field, name]) => {
      if (!updateUserPasswordProps[field as keyof UpdateUserPasswordProps]) {
        throw this.errorsValidation.missingParamError(name);
      }
    });
  };

  /**
   * Valida o tamanho da senha
   * @param password Senha a ser validada
   * @param passwordName Nome do campo de senha para mensagem de erro
   * @throws {ErrorApp} Quando a senha for menor que 8 caracteres
   */
  private validatePassword = (password: string, passwordName: string): void => {
    if (password.length < 8) {
      throw this.errorsValidation.invalidParamError(passwordName);
    }
  };

  /**
   * Verifica se a senha atual está correta
   * @param id ID do usuário
   * @param password Senha atual
   * @throws {ErrorApp} Quando a senha atual estiver incorreta
   */
  private checkMatchingPassword = async (
    id: string,
    password: string
  ): Promise<void> => {
    const userMapped = await this.userRepository.findById(id);
    const user = await this.userRepository.findByEmail(userMapped!.email);

    if (
      !(await this.encrypter.verify({
        password,
        passwordHash: user!.password,
      }))
    ) {
      throw this.errorsValidation.wrongPasswordError("senha atual");
    }
  };

  /**
   * Valida as propriedades de atualização de senha
   * @param updatePasswordData Objeto contendo ID do usuário e dados da nova senha
   * @throws {ErrorApp} Quando alguma validação falhar
   */
  public validateUpdatePasswordProps = async (updatePasswordData: {
    id: string;
    props: UpdateUserPasswordProps;
  }): Promise<void> => {
    const { id, props: passwordProps } = updatePasswordData;

    this.checkMissingUpdatePasswordProps(passwordProps);
    this.validatePassword(passwordProps.oldPassword, "senha atual");
    await this.checkMatchingPassword(id, passwordProps.oldPassword);
    this.validatePassword(passwordProps.newPassword, "nova senha");
  };
}
