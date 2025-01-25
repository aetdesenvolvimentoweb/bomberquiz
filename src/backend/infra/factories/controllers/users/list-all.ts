import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListAllUsersController } from "@/backend/presentation/controllers";
import { makeListAllUsersService } from "../../services";

export const makeListAllUsersController = (): ListAllUsersController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const listAllUsersService = makeListAllUsersService();
  return new ListAllUsersController({
    httpResponsesHelper,
    listAllUsersService,
  });
};
