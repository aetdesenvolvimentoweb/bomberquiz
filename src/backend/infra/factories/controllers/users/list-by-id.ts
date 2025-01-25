import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListUserByIdController } from "@/backend/presentation/controllers";
import { makeListUserByIdService } from "../../services";

export const makeListUserByIdController = (): ListUserByIdController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const listUserByIdService = makeListUserByIdService();
  return new ListUserByIdController({
    httpResponsesHelper,
    listUserByIdService,
  });
};
