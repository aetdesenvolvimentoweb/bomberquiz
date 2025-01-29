/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import { Controller } from "@/backend/presentation/protocols/controller";

interface HandleProps {
  request: NextRequest;
  controller: Controller;
  dynamicParams?: any;
}

export class NextjsRouteAdapter {
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
