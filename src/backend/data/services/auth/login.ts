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
  ): Promise<UserLogged | null> => {
    const { loginValidator, authRepository } = this.props;

    await loginValidator.validateLogin(loginProps);
    return await authRepository.login(loginProps);
  };
}
