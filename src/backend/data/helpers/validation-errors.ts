import { AppError } from "../errors";

export const missingParamError = (param: string): AppError => {
  return new AppError(`Preencha o campo ${param}.`, 400);
};

export const invalidParamError = (param: string): AppError => {
  return new AppError(`Valor inválido para o campo: ${param}.`, 400);
};

export const duplicatedKeyError = (props: {
  entity: string;
  key: string;
}): AppError => {
  return new AppError(
    `Já existe ${props.entity} registrada(o) com essa(e) ${props.key}.`,
    400
  );
};
