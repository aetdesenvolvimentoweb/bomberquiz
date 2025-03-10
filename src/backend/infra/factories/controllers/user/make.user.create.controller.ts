import { UserCreateData } from "@/backend/domain/entities";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { UserCreateController } from "@/backend/presentation/controllers";
import { Controller } from "@/backend/presentation/protocols";

import { makeUserCreateService } from "../../services/user/make.user.create.service";

export const makeUserCreateController = (): Controller<UserCreateData> => {
  const loggerProvider = new ConsoleLoggerProvider();
  const userCreateService = makeUserCreateService();
  return new UserCreateController({
    loggerProvider,
    userCreateService,
  });
};
