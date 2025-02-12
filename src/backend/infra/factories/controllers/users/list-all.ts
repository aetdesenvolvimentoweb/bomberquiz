import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListAllUsersController } from "@/backend/presentation/controllers";
import { makeUserFindAllService } from "../../services";

export const makeListAllUsersController = (): ListAllUsersController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userFindAllService = makeUserFindAllService();
  return new ListAllUsersController({
    httpResponsesHelper,
    userFindAllService,
  });
};
