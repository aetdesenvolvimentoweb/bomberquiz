import { CreateUserController } from "@/backend/presentation/controllers";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { makeUserCreateService } from "../../services";

export const makeCreateUserController = (): CreateUserController => {
  const userCreateService = makeUserCreateService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new CreateUserController({
    userCreateService,
    httpResponsesHelper,
  });
};
