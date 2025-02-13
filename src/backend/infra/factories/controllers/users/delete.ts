import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserDeleteController } from "@/backend/presentation/controllers";
import { makeUserDeleteService } from "../../services";

export const makeUserDeleteController = (): UserDeleteController => {
  const userDeleteService = makeUserDeleteService();
  const httpResponsesHelper = new HttpResponsesHelper();
  return new UserDeleteController({
    userDeleteService,
    httpResponsesHelper,
  });
};
