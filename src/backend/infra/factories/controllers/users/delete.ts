import { DeleteUserController } from "@/backend/presentation/controllers";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { makeUserDeleteService } from "../../services";

export const makeDeleteUserController = (): DeleteUserController => {
  const userDeleteService = makeUserDeleteService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new DeleteUserController({
    userDeleteService,
    httpResponsesHelper,
  });
};
