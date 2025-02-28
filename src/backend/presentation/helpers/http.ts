import { ApplicationError } from "@/backend/domain/errors";
import { HttpResponse } from "../protocols";

export const created = (): HttpResponse => {
  return {
    body: {
      success: true,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
    statusCode: 201,
  };
};

export const badRequest = (
  errorMessage: string,
  statusCode = 400,
): HttpResponse => {
  return {
    body: {
      success: false,
      errorMessage,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
    statusCode,
  };
};

export const serverError = (): HttpResponse => {
  return {
    body: {
      success: false,
      errorMessage: "Erro interno do servidor",
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
    statusCode: 500,
  };
};

export const errorHandler = (error: unknown): HttpResponse => {
  if (error instanceof ApplicationError) {
    return {
      body: {
        success: false,
        errorMessage: error.message,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
      statusCode: error.statusCode,
    };
  }
  return serverError();
};
