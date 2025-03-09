import {
  UserCreateUseCase,
  UserFindByEmailUseCase,
} from "@/backend/domain/usecases";

export type UserRepository = UserCreateUseCase & UserFindByEmailUseCase;
