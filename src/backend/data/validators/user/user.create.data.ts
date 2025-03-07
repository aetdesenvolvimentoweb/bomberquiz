import {
  UserBirthdateValidatorUseCase,
  UserCreateDataValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import { UserCreateData } from "@/backend/domain/entities";
import { MissingParamError } from "@/backend/domain/erros";

interface UserCreateDataValidatorProps {
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
  userPasswordValidator: UserPasswordValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
}
export class UserCreateDataValidator implements UserCreateDataValidatorUseCase {
  constructor(private readonly props: UserCreateDataValidatorProps) {}

  public readonly validate = async (data: UserCreateData): Promise<void> => {
    const {
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
    } = this.props;

    const requiredFields: { field: keyof UserCreateData; label: string }[] = [
      { field: "name", label: "nome" },
      { field: "email", label: "email" },
      { field: "phone", label: "telefone" },
      { field: "birthdate", label: "data de nascimento" },
      { field: "password", label: "senha" },
    ];

    requiredFields.forEach(({ field, label }) => {
      if (!data[field]) {
        throw new MissingParamError(label);
      }
    });

    userEmailValidator.validate(data.email);
    userPhoneValidator.validate(data.phone);
    userBirthdateValidator.validate(data.birthdate);
    userPasswordValidator.validate(data.password);
  };
}
