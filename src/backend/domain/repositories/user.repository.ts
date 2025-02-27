import { UserCreateUseCase } from "../usecases";

/**
 * Interface que define as operações de repositório disponíveis para a entidade User.
 * Combina as interfaces de criação e busca por email.
 * @see UserCreateUseCase
 */
export type UserRepository = UserCreateUseCase;
