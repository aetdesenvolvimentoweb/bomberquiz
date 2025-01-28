import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import {
  PrismaUserRepositoryAdapter,
  db,
} from "@/backend/infra/adapters/prisma";
import { BcryptEncrypterAdapter } from "@/backend/infra/adapters/bcrypt/encrypter";
import { LoginProps } from "@/backend/domain/entities";
import { makeLoginController } from "@/backend/infra/factories";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "GET":
      await db.user.deleteMany({});
      const email = "email@teste.com";
      const password = "any_password";
      const encrypter = new BcryptEncrypterAdapter();

      const userRepository = new PrismaUserRepositoryAdapter();

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

      const loginController = makeLoginController();

      const httpRequest: HttpRequest<LoginProps> = {
        body: {
          email,
          password,
        },
      };

      const httpResponse = await loginController.handle(httpRequest);

      console.log("qual o httpResponse", httpResponse);

      const response = NextResponse.json<HttpResponse>({
        body: {},
        statusCode: 204,
      });

      response.cookies.set(
        "_BomberQuiz_Session_Token",
        httpResponse.headers!["tokenJwt"],
        {
          maxAge: 86400,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        }
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

export { handler as GET };
