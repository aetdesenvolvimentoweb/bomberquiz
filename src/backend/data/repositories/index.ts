/**
 * Módulo de exportação para repositórios na camada de dados
 *
 * Este arquivo centraliza a exportação de todos os repositórios implementados
 * na camada de dados (data layer), seguindo o padrão de barril (barrel pattern).
 * Isso permite importar qualquer repositório a partir de um único ponto de entrada,
 * simplificando as importações em outros módulos.
 *
 * Repositórios incluídos:
 * - InMemoryUserRepository: Implementação em memória do repositório de usuários,
 *   projetada principalmente para uso em testes unitários e de integração.
 *
 * @module data/repositories
 *
 * @example
 *
 * // Importação simplificada de repositórios
 * import { InMemoryUserRepository } from "@/backend/data/repositories";
 *
 * // Uso em testes
 * describe('UserService', () => {
 *   let userRepository: UserRepository;
 *
 *   beforeEach(() => {
 *     userRepository = new InMemoryUserRepository();
 *   });
 *
 *   it('deve criar um usuário', async () => {
 *     // Teste utilizando o repositório em memória
 *   });
 * });
 *
 * // Uso em configuração de contêineres de injeção de dependência
 * const configureRepositories = (container) => {
 *   if (process.env.NODE_ENV === 'test') {
 *     container.register('userRepository', InMemoryUserRepository);
 *   } else {
 *     container.register('userRepository', PrismaUserRepository);
 *   }
 * };
 *
 */

export * from "./in-memory-user-repository";
