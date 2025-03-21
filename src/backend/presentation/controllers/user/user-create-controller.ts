/**
 * Controlador para criação de usuários
 *
 * Este módulo implementa o controlador responsável por processar requisições HTTP
 * para criação de novos usuários. Ele recebe os dados do usuário, delega o
 * processamento para o serviço apropriado e retorna uma resposta padronizada.
 *
 * O controlador utiliza logs estruturados para registrar cada etapa do processo,
 * facilitando o rastreamento e a depuração de problemas.
 *
 * @module presentation/controllers/user/user-create-controller
 *
 * @example
 *
 * // Uso em uma configuração de rotas
 * const userCreateController = new UserCreateController({
 *   userCreateService,
 *   loggerProvider
 * });
 *
 * app.post('/api/users', adaptRoute(userCreateController));
 */

import { UserCreateService } from "@/backend/data/services";
import { UserCreateData } from "@/backend/domain/entities";
import { MissingParamError } from "@/backend/domain/errors";
import { LoggerProvider } from "@/backend/domain/providers";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";
import { created, handleError } from "@/backend/presentation/helpers";

/**
 * Interface que define as dependências necessárias para o controlador
 *
 * @interface UserCreateControllerProps
 */
interface UserCreateControllerProps {
  /** Serviço responsável pela lógica de criação de usuários */
  userCreateService: UserCreateService;
  /** Provedor de logs para registro de eventos e erros */
  loggerProvider: LoggerProvider;
}

/**
 * Implementação do controlador para criação de usuários
 *
 * Este controlador segue o padrão de inversão de dependência,
 * recebendo suas dependências através do construtor, o que facilita
 * testes e manutenção.
 *
 * @class UserCreateController
 * @implements {Controller<UserCreateData>}
 */
export class UserCreateController implements Controller<UserCreateData> {
  /**
   * Cria uma nova instância do controlador
   *
   * @param {UserCreateControllerProps} props - Dependências do controlador
   */
  constructor(private readonly props: UserCreateControllerProps) {}

  /**
   * Processa uma requisição para criação de usuário
   *
   * Este método:
   * 1. Valida a presença do corpo da requisição
   * 2. Delega a criação do usuário para o serviço especializado
   * 3. Retorna uma resposta HTTP padronizada
   * 4. Trata qualquer erro que ocorra durante o processo
   *
   * @param {HttpRequest<UserCreateData>} request - Requisição HTTP com dados do usuário
   * @returns {Promise<HttpResponse>} Resposta HTTP padronizada
   */
  // Método auxiliar para criar o logger contextual
  // Extraído para facilitar testes
  private createContextLogger(
    request: HttpRequest<UserCreateData>,
    testContextLogger?: LoggerProvider,
  ): LoggerProvider {
    const { loggerProvider } = this.props;

    if (testContextLogger) {
      return testContextLogger;
    }

    return loggerProvider.withContext({
      action: "user.create.controller",
      metadata: {
        email: request.body?.email,
      },
    });
  }

  public readonly handle = async (
    request: HttpRequest<UserCreateData>,
    // Parâmetro opcional para facilitar testes
    testContextLogger?: LoggerProvider,
  ): Promise<HttpResponse> => {
    const { userCreateService } = this.props;

    // Criar logger contextual usando o método auxiliar
    const contextLogger = this.createContextLogger(request, testContextLogger);

    try {
      contextLogger.info("Iniciando criação de usuário via controller");

      if (!request.body) {
        throw new MissingParamError("corpo da requisição não informado");
      }

      contextLogger.info("Requisição validada com sucesso", {
        action: "request.body.validated",
      });

      await userCreateService.create(request.body as UserCreateData);

      contextLogger.info("Usuário criado com sucesso", {
        action: "user.created.controller",
      });

      return created();
    } catch (error: unknown) {
      contextLogger.error("Erro ao criar usuário", {
        action: "user.creation.failed.controller",
        metadata: { email: request.body?.email },
        error,
      });

      // Melhorar a verificação de tipos de erro
      return handleError(error);
    }
  };
}
