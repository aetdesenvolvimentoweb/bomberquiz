import { NextRequest, NextResponse } from "next/server";
import {
  makeDeleteUserController,
  makeListUserByIdController,
} from "@/backend/infra/factories";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "DELETE":
      const deleteUserController = makeDeleteUserController();
      const routeDeleteUser = new NextjsRouteAdapter();

      return await routeDeleteUser.handle({
        request,
        controller: deleteUserController,
        dynamicParams: { id: request.nextUrl.pathname.split("/").pop() },
      });

    case "GET":
      const listUserByIdController = makeListUserByIdController();
      const routeListUserById = new NextjsRouteAdapter();

      return await routeListUserById.handle({
        request,
        controller: listUserByIdController,
        dynamicParams: { id: request.nextUrl.pathname.split("/").pop() },
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

export { handler as DELETE, handler as GET };
