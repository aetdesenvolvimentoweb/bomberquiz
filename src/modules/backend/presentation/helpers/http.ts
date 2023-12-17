import {
  DuplicatedKeyError,
  InvalidParamError,
  MissingParamError,
} from "@/modules/backend/data/errors";
import { HttpResponse } from "@/modules/backend/presentation/protocols";

export const httpError = (
  error: MissingParamError | DuplicatedKeyError | InvalidParamError
): HttpResponse => {
  console.log("dentro do httpError");
  if (
    error instanceof MissingParamError ||
    error instanceof DuplicatedKeyError ||
    error instanceof InvalidParamError
  ) {
    console.log("no if", error.statusCode);

    return { error: error.message, statusCode: error.statusCode };
  } else {
    return { error: "Erro no servidor.", statusCode: 500 };
  }
};

export const success = (data: any, statusCode = 200): HttpResponse => ({
  data,
  statusCode,
});
