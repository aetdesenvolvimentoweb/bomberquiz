import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserProfileController } from "@/backend/presentation/controllers";
import { makeUserUpdateProfileService } from "../../services";

export const makeUpdateUserProfileController =
  (): UpdateUserProfileController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const userUpdateProfileService = makeUserUpdateProfileService();
    return new UpdateUserProfileController({
      httpResponsesHelper,
      userUpdateProfileService,
    });
  };
