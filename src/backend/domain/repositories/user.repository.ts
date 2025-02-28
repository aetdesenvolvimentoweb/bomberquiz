import { UserCreateUseCase, UserFindByEmailUseCase } from "../usecases";

/**
 * Interface que define as operações de repositório disponíveis para a entidade User.
 * Combina as interfaces de criação e busca por email.
 * @see UserCreateUseCase
 * @see UserFindByEmailUseCase
 */
export type UserRepository = UserCreateUseCase & UserFindByEmailUseCase;
