import {
  AuthorizeUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AuthRepository } from "../../repositories";

interface AuthorizeServiceProps {
  loginValidator: LoginValidatorUseCase;
  authRepository: AuthRepository;
}

export class AuthorizeService implements AuthorizeUseCase {
  constructor(private props: AuthorizeServiceProps) {}

  public readonly authorize = async (
    loginProps: LoginProps
  ): Promise<UserLogged> => {
    const { loginValidator, authRepository } = this.props;

    await loginValidator.validateLogin(loginProps);
    const userLogged = await authRepository.authorize(loginProps);
    return {
      id: userLogged!.id,
      name: userLogged!.name,
      email: userLogged!.email,
      role: userLogged!.role,
    };
  };
}
