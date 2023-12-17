export class NotRegisteredError extends Error {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(entitie: string, statusCode: number = 400) {
    super(`Nenhum(a) ${entitie} cadastrado(a) com esse identificador.`);
    this.message = `Nenhum(a) ${entitie} cadastrado(a) com esse identificador.`;
    this.statusCode = statusCode;
    this.name = "NotRegisteredError";
  }
}
