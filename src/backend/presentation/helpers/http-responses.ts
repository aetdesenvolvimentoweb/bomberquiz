import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponse } from "../protocols";

/**
 * Define os helpers para respostas HTTP padronizadas
 */
export class HttpResponsesHelper {
  /**
   * Cria uma resposta de erro 400 (Bad Request)
   * @param error Erro da aplicação
   * @returns Resposta HTTP formatada
   */
  public readonly badRequest = (error: ErrorApp): HttpResponse => ({
    body: { error: error.message },
    statusCode: error.statusCode,
  });

  /**
   * Cria uma resposta de sucesso 201 (Created)
   * @returns Resposta HTTP formatada
   */
  public readonly created = (): HttpResponse => ({
    body: {},
    statusCode: 201,
  });

  /**
   * Cria uma resposta de sucesso 204 (No Content)
   * @returns Resposta HTTP formatada
   */
  public readonly noContent = (): HttpResponse => ({
    body: {},
    statusCode: 204,
  });

  /**
   * Cria uma resposta de sucesso 200 (OK)
   * @param data Dados a serem retornados
   * @returns Resposta HTTP formatada
   */
  public readonly ok = (data: unknown): HttpResponse => ({
    body: { data },
    statusCode: 200,
  });

  /**
   * Cria uma resposta de erro 500 (Internal Server Error)
   * @returns Resposta HTTP formatada
   */
  public readonly serverError = (): HttpResponse => ({
    body: { error: "Erro inesperado no servidor." },
    statusCode: 500,
  });
}
