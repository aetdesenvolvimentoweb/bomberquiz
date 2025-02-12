import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserRoleController } from "@/backend/presentation/controllers";
import { makeUserUpdateRoleService } from "../../services";

export const makeUpdateUserRoleController = (): UpdateUserRoleController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userUpdateRoleService = makeUserUpdateRoleService();
  return new UpdateUserRoleController({
    httpResponsesHelper,
    userUpdateRoleService,
  });
};
