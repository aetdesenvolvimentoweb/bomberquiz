/**
 * Exportações centralizadas para factories de serviços
 *
 * Este arquivo centraliza todas as exportações de factories relacionadas a serviços,
 * facilitando a importação destas factories em outros módulos da aplicação.
 *
 * As factories são responsáveis pela instanciação e montagem das dependências dos serviços,
 * seguindo o padrão de projeto Factory Method. Este padrão permite:
 * - Encapsular a lógica de criação de objetos complexos
 * - Isolar o código cliente das implementações concretas
 * - Facilitar a substituição de dependências para testes
 * - Garantir a injeção correta de todas as dependências necessárias
 *
 * Atualmente exporta:
 * - Factories relacionadas aos serviços de usuário:
 *   - makeUserCreateService: Factory para criação do serviço de cadastro de usuários,
 *     que configura todas as dependências necessárias como validadores, sanitizadores,
 *     repositórios e provedores.
 *
 * @example
 * // Em vez de:
 * import { makeUserCreateService } from "@/backend/infra/factories/services/user";
 *
 * // É possível usar:
 * import { makeUserCreateService } from "@/backend/infra/factories/services";
 *
 * @example
 * // Uso da factory para obter uma instância configurada do serviço
 * const userCreateService = makeUserCreateService();
 *
 * // A instância retornada já possui todas as dependências necessárias injetadas
 * const result = await userCreateService.execute({
 *   name: "Nome do Usuário",
 *   email: "usuario@exemplo.com",
 *   // outros dados necessários
 * });
 *
 * @module infra/factories/services
 * @see {@link ../user/make-user-create-service.ts} para detalhes de implementação da factory
 */

export * from "./user";
