export class MissingParamError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(param: string, statusCode: number = 400) {
    super(`Preencha o campo: ${param}.`);
    this.message = `Preencha o campo: ${param}.`;
    this.statusCode = statusCode;
    this.name = "MissingParamError";
  }
}
