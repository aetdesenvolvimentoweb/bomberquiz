import { DeleteUserController } from "@/backend/presentation/controllers";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { makeDeleteUserService } from "../../services";

export const makeDeleteUserController = (): DeleteUserController => {
  const deleteUserService = makeDeleteUserService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new DeleteUserController({
    deleteUserService,
    httpResponsesHelper,
  });
};
