import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";
import { NextjsRouteAdapter } from "@/backend/infra/adapters";
import { makeAuthLoginController } from "@/backend/infra/factories";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "POST":
      const controller = makeAuthLoginController();
      const nextjsRouteAdapter = new NextjsRouteAdapter();
      return await nextjsRouteAdapter.handle({
        request,
        controller,
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

export { handler as POST };
