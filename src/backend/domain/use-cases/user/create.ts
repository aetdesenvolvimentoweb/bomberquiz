import { UserProps } from "../../entities";

export type CreateUserUseCase = {
  create: (userProps: UserProps) => Promise<void>;
};
