import { ApplicationError } from "../application.error";

describe("ApplicationError", () => {
  it("should create an application error with the provided message and status code", () => {
    const message = "Acesso não autorizado";
    const error = new ApplicationError(message, 401);

    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(401);
  });
});
