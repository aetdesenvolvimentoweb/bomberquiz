import { MissingParamError } from "../missing.param.error";

describe("MissingParamError", () => {
  it("should create an error with the provided message", () => {
    const message = "Parâmetro obrigatório não informado: any-param";
    const error = new MissingParamError("any-param");

    expect(error.message).toBe(message);
  });
});
