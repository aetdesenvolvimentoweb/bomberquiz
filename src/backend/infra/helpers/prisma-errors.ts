import { AppError } from "@/backend/data/errors";

export const prismaConnectionError = (): AppError => {
  return new AppError(
    "Erro na conexão com o banco de dados. Verifique sua conexão com a internet.",
    500
  );
};

export const prismaOperationError = (operation: string): AppError => {
  return new AppError(
    `Erro ao ${operation} registro(s) no banco de dados.`,
    500
  );
};
