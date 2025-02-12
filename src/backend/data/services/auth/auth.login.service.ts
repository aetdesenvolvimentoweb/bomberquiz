import {
  AuthLoginPropsValidatorUseCase,
  AuthLoginUseCase,
  AuthTokenHandlerUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps } from "@/backend/domain/entities";

interface AuthLoginServiceProps {
  authLoginValidator: AuthLoginPropsValidatorUseCase;
  authTokenHandler: AuthTokenHandlerUseCase;
}

/**
 * Implementa o serviço de login no sistema
 */
export class AuthLoginService implements AuthLoginUseCase {
  private authLoginValidator;
  private authTokenHandler;

  constructor(private props: AuthLoginServiceProps) {
    this.authLoginValidator = props.authLoginValidator;
    this.authTokenHandler = props.authTokenHandler;
  }

  /**
   * Realiza o login do usuário no sistema
   * @param loginProps Propriedades de login do usuário
   * @returns Promise com token de autenticação
   * @throws {ErrorApp} Quando a operação falhar
   */
  public login = async (loginProps: LoginProps): Promise<string> => {
    const userLogged = await this.authLoginValidator.validateLogin(loginProps);
    return this.authTokenHandler.generate(userLogged);
  };
}
