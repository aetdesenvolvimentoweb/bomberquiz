import { InvalidParamError } from "../invalid.param.error";

describe("InvalidParamError", () => {
  it("should create an invalid param error with the provided message", () => {
    const message = "Parâmetro inválido: any-param";
    const error = new InvalidParamError("any-param");

    expect(error.message).toBe(message);
  });

  it("should create an invalid param error with status code 400", () => {
    const error = new InvalidParamError("any-param");

    expect(error.statusCode).toBe(400);
  });
});
