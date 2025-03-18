/**
 * Módulo de exportação para repositórios do domínio
 *
 * Este arquivo centraliza a exportação de todas as interfaces de repositórios
 * que definem os contratos para acesso a dados persistentes na aplicação.
 * Seguindo o padrão de barril (barrel pattern), ele simplifica as importações
 * em outros módulos da aplicação.
 *
 * Os repositórios aqui exportados seguem o princípio de inversão de dependência (DIP)
 * do SOLID, permitindo que a camada de domínio defina interfaces que serão
 * implementadas pela camada de infraestrutura.
 *
 * @module domain/repositories
 *
 * @example
 *
 * // Importação simplificada em outros módulos
 * import { UserRepository } from "@/backend/domain/repositories";
 *
 * class SomeService {
 *   constructor(private userRepo: UserRepository) {}
 *   // ...
 * }
 *
 */

/** Exporta a interface do repositório de usuários */
export * from "./user-repository";
