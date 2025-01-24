import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import { AuthorizeService, LoginService } from "@/backend/data/services";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/data/__mocks__";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import { HttpResponses } from "@/backend/presentation/helpers";
import { LoginController } from "@/backend/presentation/controllers";
import { LoginProps } from "@/backend/domain/entities";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "POST":
      const { email, password }: LoginProps = await request.json();
      const encrypter = new EncrypterStub();

      const userRepository = new UserRepositoryInMemory();

      if ((await userRepository.listAll()).length === 0) {
        await userRepository.create({
          name: "any_name",
          email,
          phone: "any_phone",
          birthdate: new Date(),
          role: "cliente",
          password: await encrypter.encrypt(password),
        });
      }
      const authRepository = new AuthRepositoryInMemory(userRepository);
      const emailValidator = new EmailValidatorStub();
      const validationErrors = new ValidationErrors();
      const loginValidator = new LoginValidator({
        authRepository,
        emailValidator,
        encrypter,
        validationErrors,
      });
      const authorizeService = new AuthorizeService({
        authRepository,
        loginValidator,
      });
      const httpResponses = new HttpResponses();
      const tokenHandler = new TokenHandlerStub();
      const loginService = new LoginService({
        tokenHandler,
      });
      const loginController = new LoginController({
        authorizeService,
        httpResponses,
        loginService,
      });

      const httpRequest: HttpRequest<LoginProps> = {
        body: {
          email,
          password,
        },
      };

      const httpResponse = await loginController.handle(httpRequest);

      const response = NextResponse.json<HttpResponse>({
        body: {},
        statusCode: 204,
      });

      response.cookies.set(
        "_BomberQuiz_Session_Token",
        httpResponse.headers!["tokenJwt"]
      );

      return response;

    default:
      return NextResponse.json<HttpResponse>({
        body: {
          error: "Método não autorizado.",
        },
        statusCode: 405,
      });
  }
};

export { handler as POST };
