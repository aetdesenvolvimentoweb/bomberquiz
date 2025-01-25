import { CreateUserController } from "@/backend/presentation/controllers";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { makeCreateUserService } from "../../services";

export const makeCreateUserController = (): CreateUserController => {
  const createUserService = makeCreateUserService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new CreateUserController({
    createUserService,
    httpResponsesHelper,
  });
};
