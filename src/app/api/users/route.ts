import { NextRequest, NextResponse } from "next/server";
import {
  makeCreateUserController,
  makeListAllUsersController,
} from "@/backend/infra/factories";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";

const handler = async (
  request: NextRequest
): Promise<NextResponse<HttpResponse>> => {
  switch (request.method) {
    case "POST":
      const routeCreateUser = new NextjsRouteAdapter();
      const createUserController = makeCreateUserController();
      return await routeCreateUser.handle({
        request,
        controller: createUserController,
      });

    case "GET":
      const listAllUserscontroller = makeListAllUsersController();
      const routeListAllUsers = new NextjsRouteAdapter();
      return await routeListAllUsers.handle({
        request,
        controller: listAllUserscontroller,
      });

    default:
      return NextResponse.json<HttpResponse>({
        body: {
          error: "Método não autorizado.",
        },
        statusCode: 405,
      });
  }
};

export { handler as POST, handler as GET };
