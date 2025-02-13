import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";
import { makeUserUpdateProfileController } from "@/backend/infra/factories";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "PUT":
      const userUpdateProfileController = makeUserUpdateProfileController();
      const routeUpdateUserProfile = new NextjsRouteAdapter();
      return await routeUpdateUserProfile.handle({
        request,
        controller: userUpdateProfileController,
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

export { handler as PUT };
