import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import { EncrypterStub } from "@/backend/data/__mocks__";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListAllUsersController } from "@/backend/presentation/controllers";
import { ListAllUsersService } from "@/backend/data/services";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "GET":
      const email = "valid_email";
      const password = "any_password";
      const encrypter = new EncrypterStub();

      if (!request.cookies.get("_BomberQuiz_Session_Token")) {
        return NextResponse.json<HttpResponse>({
          body: {
            error: "Faça login novamente.",
          },
          statusCode: 401,
        });
      }

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
      const listAllUsersService = new ListAllUsersService({
        userRepository,
      });
      const httpResponsesHelper = new HttpResponsesHelper();
      const listAllUsersController = new ListAllUsersController({
        listAllUsersService,
        httpResponsesHelper,
      });

      const httpRequest: HttpRequest = {
        body: {},
      };

      const httpResponse = await listAllUsersController.handle(httpRequest);

      return NextResponse.json<HttpResponse>(httpResponse);

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
