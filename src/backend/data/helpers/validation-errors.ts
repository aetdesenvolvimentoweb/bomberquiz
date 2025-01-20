import { AppError } from "../errors";

export class ValidationErrors {
  public readonly missingParamError = (param: string): AppError => {
    return new AppError(`Preencha o campo ${param}.`, 400);
  };

  public readonly invalidParamError = (param: string): AppError => {
    return new AppError(`Valor inválido para o campo: ${param}.`, 400);
  };

  public readonly duplicatedKeyError = (props: {
    entity: string;
    key: string;
  }): AppError => {
    return new AppError(
      `Já existe ${props.entity} registrada(o) com essa(e) ${props.key}.`,
      400
    );
  };

  public readonly unregisteredError = (param: string): AppError => {
    return new AppError(`Nenhum registro encontrado para esse ${param}.`, 404);
  };

  public readonly wrongPasswordError = (param: string): AppError => {
    return new AppError(`${param} incorreta.`, 401);
  };
}
