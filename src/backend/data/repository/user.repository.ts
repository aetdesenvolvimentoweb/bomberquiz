import {
  UserCreateUseCase,
  UserDeleteUseCase,
  UserFindAllUseCase,
  UserFindByEmailUseCase,
  UserFindByIdUseCase,
  UserUpdatePasswordUseCase,
  UserUpdateProfileUseCase,
  UserUpdateRoleUseCase,
} from "@/backend/domain/use-cases";

/**
 * Define o repositório para usuários no sistema
 */
export type UserRepository = UserCreateUseCase &
  UserDeleteUseCase &
  UserFindAllUseCase &
  UserFindByEmailUseCase &
  UserFindByIdUseCase &
  UserUpdatePasswordUseCase &
  UserUpdateProfileUseCase &
  UserUpdateRoleUseCase;
