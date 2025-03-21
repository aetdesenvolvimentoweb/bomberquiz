/**
 * Exportações centralizadas para factories de serviços de usuário
 *
 * Este arquivo centraliza todas as exportações de factories relacionadas aos serviços de usuário,
 * facilitando a importação destas factories em outros módulos da aplicação.
 *
 * As factories de serviços de usuário são responsáveis por criar e configurar instâncias
 * de serviços que implementam casos de uso relacionados a usuários, como criação,
 * autenticação, atualização e remoção de contas.
 *
 * Atualmente exporta:
 * - makeUserCreateService: Factory para criação do serviço de cadastro de usuários,
 *   que configura todas as dependências necessárias como validadores, sanitizadores,
 *   repositórios e provedores.
 *
 * @example
 * // Importação da factory
 * import { makeUserCreateService } from "@/backend/infra/factories/services/user";
 *
 * // Uso da factory para obter uma instância configurada do serviço
 * const userCreateService = makeUserCreateService();
 *
 * // A instância retornada já possui todas as dependências necessárias injetadas
 * const result = await userCreateService.execute({
 *   name: "Nome do Usuário",
 *   email: "usuario@exemplo.com",
 *   password: "senha123",
 *   birthdate: "1990-01-01",
 *   phone: "+5511999999999"
 * });
 *
 * @module infra/factories/services/user
 * @see {@link ./make-user-create-service.ts} para detalhes de implementação da factory
 */

export * from "./make-user-create-service";
