import {
  AuthLoginPropsValidatorUseCase,
  AuthLoginUseCase,
  AuthTokenHandlerUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps } from "@/backend/domain/entities";

interface ConstructorProps {
  loginValidator: AuthLoginPropsValidatorUseCase;
  authTokenHandler: AuthTokenHandlerUseCase;
}

export class LoginService implements AuthLoginUseCase {
  constructor(private props: ConstructorProps) {}

  public readonly login = async (loginProps: LoginProps): Promise<string> => {
    const { loginValidator, authTokenHandler } = this.props;

    const userLogged = await loginValidator.validateLogin(loginProps);

    return authTokenHandler.generate(userLogged);
  };
}
