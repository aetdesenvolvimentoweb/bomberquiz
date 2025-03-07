import { UserCreateData } from "@/backend/domain/entities";
import { MissingParamError } from "@/backend/domain/erros";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";

export class UserCreateDataValidator implements UserCreateDataValidatorUseCase {
  public readonly validate = async (data: UserCreateData): Promise<void> => {
    const requiredFields: { field: keyof UserCreateData; label: string }[] = [
      { field: "name", label: "nome" },
      { field: "email", label: "email" },
    ];

    requiredFields.forEach(({ field, label }) => {
      if (!data[field]) {
        throw new MissingParamError(label);
      }
    });
  };
}
