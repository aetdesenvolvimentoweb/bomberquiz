import { LoginUseCase, TokenHandlerUseCase } from "@/backend/domain/use-cases";
import { UserLogged } from "@/backend/domain/entities";

interface LoginServiceProps {
  tokenHandler: TokenHandlerUseCase;
}

export class LoginService implements LoginUseCase {
  constructor(private props: LoginServiceProps) {}

  public readonly login = (userLogged: UserLogged): string => {
    const { tokenHandler } = this.props;

    return tokenHandler.generate(userLogged);
  };
}
