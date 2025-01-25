import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserRoleController } from "@/backend/presentation/controllers";
import { makeUpdateUserRoleService } from "../../services";

export const makeUpdateUserRoleController = (): UpdateUserRoleController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const updateUserRoleService = makeUpdateUserRoleService();
  return new UpdateUserRoleController({
    httpResponsesHelper,
    updateUserRoleService,
  });
};
