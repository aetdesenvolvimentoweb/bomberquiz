import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponse } from "../protocols";

export class HttpResponsesHelper {
  public readonly badRequest = (error: ErrorApp): HttpResponse => {
    return {
      body: {
        error: error.message,
      },
      statusCode: error.statusCode,
    };
  };

  public readonly created = (): HttpResponse => {
    return {
      body: {},
      statusCode: 201,
    };
  };

  public readonly noContent = (): HttpResponse => {
    return {
      body: {},
      statusCode: 204,
    };
  };

  public readonly ok = (data: unknown): HttpResponse => {
    return {
      body: { data },
      statusCode: 200,
    };
  };

  public readonly serverError = (): HttpResponse => {
    return {
      body: {
        error: "Erro inesperado no servidor.",
      },
      statusCode: 500,
    };
  };
}
