import { MissingParamError } from "../missing.param.error";

describe("MissingParamError", () => {
  it("should create an error with the provided message", () => {
    const message = "Parâmetro obrigatório não informado: any-param";
    const error = new MissingParamError("any-param");

    expect(error.message).toBe(message);
  });

  it("should create a missing param error with status code 400", () => {
    const error = new MissingParamError("any-param");

    expect(error.statusCode).toBe(400);
  });
});
