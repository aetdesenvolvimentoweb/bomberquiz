import {
  DuplicatedKeyError,
  MissingParamError,
} from "@/modules/backend/data/errors";
import { HttpResponse } from "@/modules/backend/presentation/protocols";

export const httpError = (
  error: MissingParamError | DuplicatedKeyError
): HttpResponse => {
  if (
    error instanceof MissingParamError ||
    error instanceof DuplicatedKeyError
  ) {
    return { error: error.message, statusCode: error.statusCode };
  } else {
    return { error: "Erro no servidor.", statusCode: 500 };
  }
};

export const success = (data: any, statusCode = 200): HttpResponse => ({
  data,
  statusCode,
});
