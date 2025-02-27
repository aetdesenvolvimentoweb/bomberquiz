import { MissingParamError } from "@/backend/domain/errors";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";

/**
 * Implementação do validador para criação de usuário
 * @implements {UserCreateValidatorUseCase}
 */
export class UserCreateValidator implements UserCreateValidatorUseCase {
  constructor() {}
  /**
   * Valida os dados para criação de usuário
   * @param data Dados do usuário a serem validados
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   */

  private checkMissingParams(data: UserCreateData) {
    const requiredFields: { key: keyof UserCreateData; label: string }[] = [
      { key: "name", label: "nome" },
      { key: "email", label: "email" },
      { key: "phone", label: "telefone" },
    ];

    for (const field of requiredFields) {
      if (!data[field.key]) throw new MissingParamError(field.label);
    }
  }

  public readonly validate = async (data: UserCreateData): Promise<void> => {
    this.checkMissingParams(data);
  };
}
