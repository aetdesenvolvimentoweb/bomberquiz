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

export const serverError = (error: unknown): HttpResponse => {
  return {
    body: {
      success: false,
      errorMessage: (error as Error).message,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    },
    statusCode: 500,
  };
};

export const handleError = (error: unknown): HttpResponse => {
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

  // Se o erro não for ApplicationError, criar um ServerError
  return serverError(error);
};
