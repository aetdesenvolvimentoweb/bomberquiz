import { ApplicationError } from "@/backend/domain/errors";

describe("ApplicationError", () => {
  it("should create an application error with the provided message and status code", () => {
    const message = "Acesso não autorizado";
    const error = new ApplicationError(message, 401);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(401);
  });

  it("should create an application error with status code default", () => {
    const error = new ApplicationError("any-message");

    expect(error.statusCode).toBe(400);
  });
});
