import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserCreateController } from "@/backend/presentation/controllers";
import { makeUserCreateService } from "../../services";

export const makeUserCreateController = (): UserCreateController => {
  const userCreateService = makeUserCreateService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new UserCreateController({
    userCreateService,
    httpResponsesHelper,
  });
};
