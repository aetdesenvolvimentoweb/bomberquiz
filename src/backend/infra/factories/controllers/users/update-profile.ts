import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserUpdateProfileController } from "@/backend/presentation/controllers";
import { makeUserUpdateProfileService } from "../../services";

export const makeUserUpdateProfileController =
  (): UserUpdateProfileController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const userUpdateProfileService = makeUserUpdateProfileService();
    return new UserUpdateProfileController({
      httpResponsesHelper,
      userUpdateProfileService,
    });
  };
