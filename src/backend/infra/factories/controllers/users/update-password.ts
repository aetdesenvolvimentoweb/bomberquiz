import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserUpdatePasswordController } from "@/backend/presentation/controllers";
import { makeUserUpdatePasswordService } from "../../services";

export const makeUserUpdatePasswordController =
  (): UserUpdatePasswordController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const userUpdatePasswordService = makeUserUpdatePasswordService();
    return new UserUpdatePasswordController({
      httpResponsesHelper,
      userUpdatePasswordService,
    });
  };
