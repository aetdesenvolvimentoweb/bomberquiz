import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";
import { db } from "@/backend/infra/adapters/prisma";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "GET":
      await db.user.deleteMany({});
      const response = NextResponse.json<HttpResponse>({
        body: {},
        statusCode: 204,
      });

      response.cookies.set("_BomberQuiz_Session_Token", "", {
        maxAge: -1,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

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
