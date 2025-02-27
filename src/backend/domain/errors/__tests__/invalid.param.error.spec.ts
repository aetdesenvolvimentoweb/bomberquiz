import { InvalidParamError } from "../invalid.param.error";

describe("InvalidParamError", () => {
  it("should create an invalid param error with the provided message", () => {
    const message = "Parâmetro inválido: any-param";
    const error = new InvalidParamError("any-param");

    expect(error.message).toBe(message);
  });
});
