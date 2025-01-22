import { AppError } from "@/backend/data/errors";
import { HttpResponse } from "../protocols";

export class HttpResponses {
  public readonly badRequest = (error: AppError): HttpResponse => {
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

  public readonly serverError = (): HttpResponse => {
    return {
      body: {
        error: "Erro inesperado no servidor.",
      },
      statusCode: 500,
    };
  };
}
