/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import { LoggerProvider } from "@/backend/domain/providers";
import { RequestValidator } from "../../protocols/request.validator";
import { UserCreateData } from "@/backend/domain/entities";

/**
 * Validador para dados de criação de usuário na camada de presentation
 * Responsável por validar o formato dos dados antes de passá-los para o serviço
 */
export class UserCreateRequestValidator
  implements RequestValidator<UserCreateData>
{
  constructor(private readonly logger: LoggerProvider) {}

  validate(input: any): void {
    // Case 1: Input is missing or null
    if (!input || Object.keys(input).length === 0 || input === null) {
      this.logger.warn("Requisição sem corpo ou com corpo vazio", {
        action: "user_create_validator_missing_body",
      });
      throw new MissingParamError("Dados não fornecidos");
    }

    // Mapa de campos para labels
    const fieldToLabelMap: Record<keyof UserCreateData, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Primeiro, verifica se todos os campos obrigatórios estão presentes
    for (const [field, label] of Object.entries(fieldToLabelMap)) {
      const fieldKey = field as keyof UserCreateData;
      if (input[fieldKey] === undefined || input[fieldKey] === null) {
        this.logger.warn(`Campo obrigatório não fornecido: ${field}`, {
          action: "user_create_validator_missing_field",
          metadata: { field },
        });
        throw new MissingParamError(label);
      }
    }

    // Depois, verifica os tipos dos campos
    if (input.birthdate && !(input.birthdate instanceof Date)) {
      this.logger.warn("Data de nascimento com tipo inválido", {
        action: "user_create_validator_invalid_birthdate",
        metadata: {
          birthdateType: typeof input.birthdate,
        },
      });
      throw new InvalidParamError("data de nascimento");
    }

    // Verifica se os outros campos são strings
    const stringFields: (keyof UserCreateData)[] = [
      "name",
      "email",
      "phone",
      "password",
    ];
    for (const field of stringFields) {
      if (input[field] !== undefined && typeof input[field] !== "string") {
        this.logger.warn(`Campo ${field} com tipo inválido`, {
          action: "user_create_validator_invalid_field_type",
          metadata: {
            field,
            fieldType: typeof input[field],
          },
        });
        throw new InvalidParamError(fieldToLabelMap[field]);
      }
    }
  }
}
