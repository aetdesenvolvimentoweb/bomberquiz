import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListUserByIdController } from "@/backend/presentation/controllers";
import { makeUserFindByIdService } from "../../services";

export const makeListUserByIdController = (): ListUserByIdController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userFindByIdService = makeUserFindByIdService();
  return new ListUserByIdController({
    httpResponsesHelper,
    userFindByIdService,
  });
};
