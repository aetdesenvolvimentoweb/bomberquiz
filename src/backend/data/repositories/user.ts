import {
  CreateUserUseCase,
  DeleteUserUseCase,
  ListAllUsersUseCase,
  ListUserByEmailUseCase,
  ListUserByIdUseCase,
  UpdateUserPasswordUseCase,
  UpdateUserProfileUseCase,
  UpdateUserRoleUseCase,
} from "@/backend/domain/use-cases";

export type UserRepository = CreateUserUseCase &
  DeleteUserUseCase &
  ListAllUsersUseCase &
  ListUserByEmailUseCase &
  ListUserByIdUseCase &
  UpdateUserPasswordUseCase &
  UpdateUserProfileUseCase &
  UpdateUserRoleUseCase;
