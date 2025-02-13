import { NextRequest, NextResponse } from "next/server";
import {
  makeUserCreateController,
  makeUserFindAllController,
} from "@/backend/infra/factories";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";

const handler = async (
  request: NextRequest
): Promise<NextResponse<HttpResponse>> => {
  switch (request.method) {
    case "POST":
      const routeCreateUser = new NextjsRouteAdapter();
      const userCreateController = makeUserCreateController();
      return await routeCreateUser.handle({
        request,
        controller: userCreateController,
      });

    case "GET":
      const userFindAllController = makeUserFindAllController();
      const routeListAllUsers = new NextjsRouteAdapter();
      return await routeListAllUsers.handle({
        request,
        controller: userFindAllController,
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
