import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import { Controller } from "@/backend/presentation/protocols/controller";

/**
 * Interface que define as propriedades necessárias para manipulação de rotas
 */
interface HandleProps {
  request: NextRequest;
  controller: Controller;
  dynamicParams?: unknown;
}

/**
 * Implementa o adaptador de rotas para Next.js
 */
export class NextjsRouteAdapter {
  /**
   * Manipula uma requisição HTTP
   * @param props Propriedades da requisição
   * @returns Resposta HTTP formatada
   */
  public readonly handle = async ({
    request,
    controller,
    dynamicParams,
  }: HandleProps): Promise<NextResponse<HttpResponse>> => {
    let body = {};

    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.json();
    }

    const httpRequest: HttpRequest = {
      body,
      dynamicParams,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    if (httpResponse.headers && httpResponse.headers["tokenJwt"]) {
      const response = NextResponse.json<HttpResponse>({
        body: httpResponse.body,
        statusCode: httpResponse.statusCode,
      });

      response.cookies.set(
        "_BomberQuiz_Session_Token",
        httpResponse.headers!["tokenJwt"],
        {
          maxAge: 86400,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        }
      );

      return response;
    }

    return NextResponse.json<HttpResponse>(httpResponse);
  };
}
