import {
  LoginUseCase,
  LoginValidatorUseCase,
  TokenHandlerUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps } from "@/backend/domain/entities";

interface LoginServiceProps {
  loginValidator: LoginValidatorUseCase;
  tokenHandler: TokenHandlerUseCase;
}

export class LoginService implements LoginUseCase {
  constructor(private props: LoginServiceProps) {}

  public readonly login = async (loginProps: LoginProps): Promise<string> => {
    const { loginValidator, tokenHandler } = this.props;

    const userLogged = await loginValidator.validateLogin(loginProps);

    return tokenHandler.generate(userLogged);
  };
}
