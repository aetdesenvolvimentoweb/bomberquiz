export class InvalidParamError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(param: string, statusCode: number = 400) {
    super(`Valor inválido para o campo: ${param}.`);
    this.message = `Valor inválido para o campo: ${param}.`;
    this.statusCode = statusCode;
    this.name = "InvalidParamError";
  }
}
