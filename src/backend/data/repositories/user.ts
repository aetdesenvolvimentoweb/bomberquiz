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

export type UserRepository = UserCreateUseCase &
  UserDeleteUseCase &
  UserFindAllUseCase &
  UserFindByEmailUseCase &
  UserFindByIdUseCase &
  UserUpdatePasswordUseCase &
  UserUpdateProfileUseCase &
  UserUpdateRoleUseCase;
