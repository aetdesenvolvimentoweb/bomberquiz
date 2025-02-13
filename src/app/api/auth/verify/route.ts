/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/backend/presentation/protocols";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { JwtTokenHandlerAdapter } from "@/backend/infra/adapters/cryptography/jsonwebtoken/auth.token-handler";

const handle = async (request: NextRequest): Promise<NextResponse> => {
  const httpResponsesHelper = new HttpResponsesHelper();
  try {
    const sessionToken = request.headers.get("Authorization");

    if (!sessionToken) {
      return NextResponse.json<HttpResponse>({
        body: {
          error: "Acesso não autorizado.",
        },
        statusCode: 401,
      });
    }

    const jwt = new JwtTokenHandlerAdapter();

    const userLogged = jwt.verify(sessionToken);

    if (!userLogged) {
      return NextResponse.json<HttpResponse>({
        body: {
          error: "Acesso não autorizado.",
        },
        statusCode: 401,
      });
    }

    return NextResponse.json<HttpResponse>(httpResponsesHelper.ok(userLogged));
  } catch (error) {
    return NextResponse.json<HttpResponse>(httpResponsesHelper.serverError());
  }
};

export { handle as GET };
