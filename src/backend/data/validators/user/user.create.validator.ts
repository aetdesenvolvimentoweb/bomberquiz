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

  private checkMissingParams(data: UserCreateData): void {
    // Mapa de campos para labels
    const fieldToLabelMap: Record<keyof UserCreateData, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Verifica cada campo obrigatório
    for (const [field, label] of Object.entries(fieldToLabelMap)) {
      if (!data[field as keyof UserCreateData]) {
        throw new MissingParamError(label);
      }
    }
  }

  public readonly validate = async (data: UserCreateData): Promise<void> => {
    this.checkMissingParams(data);
  };
}
