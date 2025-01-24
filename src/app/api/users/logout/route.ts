import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "GET":
      const response = NextResponse.json<HttpResponse>({
        body: {},
        statusCode: 204,
      });

      response.headers.set(
        "Set-Cookie",
        "_BomberQuiz_Session_Token=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; Secure; SameSite=Strict"
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
