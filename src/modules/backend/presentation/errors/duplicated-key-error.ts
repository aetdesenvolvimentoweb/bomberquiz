export class DuplicatedKeyError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(key: string, statusCode: number = 400) {
    super(`Já existe um registro para o campo ${key} com esse valor.`);
    this.message = `Já existe um registro para o campo ${key} com esse valor.`;
    this.statusCode = statusCode;
    this.name = "DuplicatedKeyError";
  }
}
