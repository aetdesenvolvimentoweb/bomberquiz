import { ServerError } from "@/backend/domain/errors";

describe("ServerError", () => {
  it("should create a server error with the provided message", () => {
    const message = "Erro inesperado do servidor. Erro desconhecido";
    const error = new ServerError(new Error("Erro desconhecido"));

    expect(error.message).toBe(message);
  });

  it("should create a server error with status code 500", () => {
    const error = new ServerError(new Error("Erro desconhecido"));

    expect(error.statusCode).toBe(500);
  });
});
