export class MissingParamError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(param: string, statusCode: number = 400) {
    super(`Campo não preenchido: ${param}.`);
    this.message = `Campo não preenchido: ${param}.`;
    this.statusCode = statusCode;
    this.name = "MissingParamError";
  }
}
