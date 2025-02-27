import { DuplicateResourceError } from "../duplicate.resource.error";

describe("DuplicateResourceError", () => {
  it("should create a duplicate resource error with the provided message", () => {
    const message = "Any Resource já cadastrado no sistema";
    const error = new DuplicateResourceError("Any Resource");

    expect(error.message).toBe(message);
  });
});
