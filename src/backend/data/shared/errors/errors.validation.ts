import { ErrorApp } from "./error.app";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";

/**
 * Define os erros de validação do sistema
 */
export class ErrorsValidation implements ErrorsValidationUseCase {
  /**
   * Cria um erro de chave duplicada
   * @param props Objeto contendo entidade e chave duplicada
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly duplicatedKeyError = (props: {
    entity: string;
    key: string;
  }): ErrorApp => {
    return new ErrorApp(
      `Já existe ${props.entity} registrada(o) com essa(e) ${props.key}.`,
      400
    );
  };

  /**
   * Cria um erro de parâmetro inválido
   * @param param Nome do parâmetro inválido
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly invalidParamError = (param: string): ErrorApp => {
    return new ErrorApp(`Valor inválido para o campo: ${param}.`, 400);
  };

  /**
   * Cria um erro de parâmetro ausente
   * @param param Nome do parâmetro ausente
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly missingParamError = (param: string): ErrorApp => {
    return new ErrorApp(`Preencha o campo ${param}.`, 400);
  };

  /**
   * Cria um erro de não autorizado
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly unauthorizedError = (): ErrorApp => {
    return new ErrorApp("Email ou senha incorreto(s).", 401);
  };

  /**
   * Cria um erro de registro não encontrado
   * @param param Nome do registro não encontrado
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly unregisteredError = (param: string): ErrorApp => {
    return new ErrorApp(`Nenhum registro encontrado para esse ${param}.`, 404);
  };

  /**
   * Cria um erro de senha incorreta
   * @param param Tipo de senha incorreta
   * @returns Erro de aplicação com mensagem formatada
   */
  public readonly wrongPasswordError = (param: string): ErrorApp => {
    return new ErrorApp(`${param} incorreta.`, 401);
  };
}
