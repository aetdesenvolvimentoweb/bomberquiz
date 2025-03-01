import { HashOperationError } from "../hash.operation.error";

describe("HashOperationError", () => {
  it("should create a hash operation error with the provided message", () => {
    const message = "Erro ao gerar hash";
    const error = new HashOperationError(message);

    expect(error.message).toBe(message);
  });

  it("should create a hash operation error with status code 500", () => {
    const error = new HashOperationError("Erro ao gerar hash");

    expect(error.statusCode).toBe(500);
  });
});
