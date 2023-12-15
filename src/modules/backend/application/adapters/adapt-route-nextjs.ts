import { NextResponse } from "next/server";
import { Controller } from "@/modules/backend/presentation/protocols";

export const adaptRouteNextjs = async (
  controller: Controller,
  request: Request
) => {
  const data = request && request.body ? await request.json() : {};
  const httpResponse = await controller.handle(data);

  if (httpResponse.error) {
    return NextResponse.json(
      { error: httpResponse.error },
      { status: httpResponse.statusCode }
    );
  } else {
    return NextResponse.json(
      { data: httpResponse.data },
      { status: httpResponse.statusCode }
    );
  }
};
