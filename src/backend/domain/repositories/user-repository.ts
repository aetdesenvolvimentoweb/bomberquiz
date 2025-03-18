import {
  UserCreateUseCase,
  UserFindByEmailUseCase,
} from "@/backend/domain/usecases";

/**
 * Interface de repositório para a entidade Usuário
 *
 * Define o contrato que qualquer implementação de repositório de usuários
 * deve seguir, combinando funcionalidades de diferentes casos de uso.
 * Esta abordagem segue o princípio de Segregação de Interfaces (ISP) do SOLID,
 * onde cada caso de uso define apenas os métodos que necessita.
 *
 * Este repositório agrega as seguintes funcionalidades:
 * - Criação de usuários ({@link UserCreateUseCase})
 * - Busca de usuários por e-mail ({@link UserFindByEmailUseCase})
 *
 * @interface
 * @extends {UserCreateUseCase}
 * @extends {UserFindByEmailUseCase}
 *
 * @remarks
 * A implementação concreta deste repositório deve ser fornecida pela camada de
 * infraestrutura, permitindo a substituição da tecnologia de persistência sem
 * afetar a lógica de negócio.
 *
 * @example
 *
 * // Exemplo de uso do repositório em um serviço
 * class UserService {
 *   constructor(private userRepository: UserRepository) {}
 *
 *   async registerUser(userData) {
 *     // Verificar se e-mail já existe
 *     const existingUser = await this.userRepository.findByEmail(userData.email);
 *     if (existingUser) {
 *       throw new DuplicateResourceError("E-mail já cadastrado");
 *     }
 *
 *     // Criar novo usuário
 *     return this.userRepository.create(userData);
 *   }
 * }
 *
 */
export type UserRepository = UserCreateUseCase & UserFindByEmailUseCase;
