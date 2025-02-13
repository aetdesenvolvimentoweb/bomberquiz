import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserFindByIdController } from "@/backend/presentation/controllers";
import { makeUserFindByIdService } from "../../services";

export const makeUserFindByIdController = (): UserFindByIdController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userFindByIdService = makeUserFindByIdService();
  return new UserFindByIdController({
    httpResponsesHelper,
    userFindByIdService,
  });
};
