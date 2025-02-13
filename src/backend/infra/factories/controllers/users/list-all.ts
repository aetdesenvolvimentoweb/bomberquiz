import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserFindAllController } from "@/backend/presentation/controllers";
import { makeUserFindAllService } from "../../services";

export const makeUserFindAllController = (): UserFindAllController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userFindAllService = makeUserFindAllService();
  return new UserFindAllController({
    httpResponsesHelper,
    userFindAllService,
  });
};
