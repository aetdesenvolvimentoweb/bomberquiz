import { DuplicateResourceError } from "@/backend/domain/errors";

describe("DuplicateResourceError", () => {
  it("should create a duplicate resource error with the provided message", () => {
    const message = "Any Resource já cadastrado no sistema";
    const error = new DuplicateResourceError("Any Resource");

    expect(error.message).toBe(message);
  });

  it("should create a duplicate resource error with status code 409", () => {
    const error = new DuplicateResourceError("Any Resource");

    expect(error.statusCode).toBe(409);
  });
});
