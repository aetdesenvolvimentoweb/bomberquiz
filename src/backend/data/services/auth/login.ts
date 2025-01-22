import { LoginProps, UserLogged } from "@/backend/domain/entities";
import {
  LoginUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { AuthRepository } from "../../repositories";

interface LoginServiceProps {
  loginValidator: LoginValidatorUseCase;
  authRepository: AuthRepository;
}

export class LoginService implements LoginUseCase {
  constructor(private props: LoginServiceProps) {}

  public readonly login = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    const { loginValidator, authRepository } = this.props;

    await loginValidator.validateLogin(loginProps);
    const userLogged = await authRepository.login(loginProps);
    return {
      id: userLogged!.id,
      name: userLogged!.name,
      email: userLogged!.email,
      role: userLogged!.role,
    };
  };
}
