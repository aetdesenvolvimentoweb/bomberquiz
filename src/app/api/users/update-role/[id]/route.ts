import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";
import { makeUpdateUserRoleController } from "@/backend/infra/factories";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "PATCH":
      const updateUserRoleController = makeUpdateUserRoleController();
      const routeUpdateUserPassword = new NextjsRouteAdapter();
      return await routeUpdateUserPassword.handle({
        request,
        controller: updateUserRoleController,
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

export { handler as PATCH };
