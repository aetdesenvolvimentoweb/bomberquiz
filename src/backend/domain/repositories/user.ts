import { UserCreateUseCase, UserFindByEmailUseCase } from "../usecases";

export type UserRepository = UserCreateUseCase & UserFindByEmailUseCase;
