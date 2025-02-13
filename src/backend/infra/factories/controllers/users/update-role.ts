import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserUpdateRoleController } from "@/backend/presentation/controllers";
import { makeUserUpdateRoleService } from "../../services";

export const makeUserUpdateRoleController = (): UserUpdateRoleController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const userUpdateRoleService = makeUserUpdateRoleService();
  return new UserUpdateRoleController({
    httpResponsesHelper,
    userUpdateRoleService,
  });
};
