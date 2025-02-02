import {
  LoginUseCase,
  LoginValidatorUseCase,
  TokenHandlerUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps } from "@/backend/domain/entities";

interface ConstructorProps {
  loginValidator: LoginValidatorUseCase;
  tokenHandler: TokenHandlerUseCase;
}

export class LoginService implements LoginUseCase {
  constructor(private props: ConstructorProps) {}

  public readonly login = async (loginProps: LoginProps): Promise<string> => {
    const { loginValidator, tokenHandler } = this.props;

    const userLogged = await loginValidator.validateLogin(loginProps);

    return tokenHandler.generate(userLogged);
  };
}
