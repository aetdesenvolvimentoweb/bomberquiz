import { CreateUserController } from "@/backend/presentation/controllers";
import { HttpResponses } from "@/backend/presentation/helpers";
import { makeCreateUserService } from "../../services";

export const makeCreateUserController = (): CreateUserController => {
  const createUserService = makeCreateUserService();
  const httpResponses = new HttpResponses();
  return new CreateUserController({
    createUserService,
    httpResponses,
  });
};
