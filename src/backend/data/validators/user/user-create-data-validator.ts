import { UserCreateData } from "@/backend/domain/entities";
import { MissingParamError } from "@/backend/domain/errors";
import {
  UserBirthdateValidatorUseCase,
  UserCreateDataValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUniqueEmailValidatorUseCase,
} from "@/backend/domain/validators";

/**
 * Propriedades necessárias para a criação do validador
 *
 * @interface UserCreateDataValidatorProps
 */
interface UserCreateDataValidatorProps {
  /** Validador para verificar a idade mínima e máxima do usuário */
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  /** Validador para verificar o formato do e-mail */
  userEmailValidator: UserEmailValidatorUseCase;
  /** Validador para verificar o formato do telefone */
  userPhoneValidator: UserPhoneValidatorUseCase;
  /** Validador para verificar a força e segurança da senha */
  userPasswordValidator: UserPasswordValidatorUseCase;
  /** Validador para verificar se o e-mail já está em uso */
  userUniqueEmailValidator: UserUniqueEmailValidatorUseCase;
}

/**
 * Implementação do validador de dados para criação de usuários
 */
export class UserCreateDataValidator implements UserCreateDataValidatorUseCase {
  constructor(private readonly props: UserCreateDataValidatorProps) {}

  /**
   * Valida os dados para criação de um novo usuário
   *
   * @param {UserCreateData} data - Dados sanitizados do usuário a ser validado
   * @returns {Promise<void>} - Promise que resolve quando os dados são válidos
   * @throws {MissingParamError} - Se algum campo obrigatório estiver ausente
   * @throws {InvalidParamError} - Se algum campo tiver formato ou valor inválido
   * @throws {DuplicateResourceError} - Se o e-mail já estiver em uso
   */
  public readonly validate = async (data: UserCreateData): Promise<void> => {
    const {
      userBirthdateValidator,
      userEmailValidator,
      userPhoneValidator,
      userPasswordValidator,
      userUniqueEmailValidator,
    } = this.props;

    // Define os campos obrigatórios com seus respectivos rótulos para mensagens de erro
    const requiredFields: { field: keyof UserCreateData; label: string }[] = [
      { field: "name", label: "nome" },
      { field: "email", label: "email" },
      { field: "phone", label: "telefone" },
      { field: "birthdate", label: "data de nascimento" },
      { field: "password", label: "senha" },
    ];

    // Verifica se todos os campos obrigatórios estão presentes
    requiredFields.forEach(({ field, label }) => {
      if (!data[field] || data[field] === undefined || data[field] === null) {
        throw new MissingParamError(label);
      }
    });

    // Executa as validações específicas para cada tipo de dado
    userEmailValidator.validate(data.email);
    await userUniqueEmailValidator.validate(data.email);
    userPhoneValidator.validate(data.phone);
    userBirthdateValidator.validate(data.birthdate);
    userPasswordValidator.validate(data.password);
  };
}
