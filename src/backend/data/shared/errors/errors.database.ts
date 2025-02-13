import { ErrorApp } from "@/backend/data/shared/errors";

export const databaseConnectionError = (): ErrorApp => {
  return new ErrorApp(
    "Erro na conexão com o banco de dados. Verifique sua conexão com a internet.",
    500
  );
};

export const databaseOperationError = (operation: string): ErrorApp => {
  return new ErrorApp(
    `Erro ao ${operation} registro(s) no banco de dados.`,
    500
  );
};
