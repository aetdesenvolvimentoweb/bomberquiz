import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserProfileController } from "@/backend/presentation/controllers";
import { makeUpdateUserProfileService } from "../../services";

export const makeUpdateUserProfileController =
  (): UpdateUserProfileController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const updateUserProfileService = makeUpdateUserProfileService();
    return new UpdateUserProfileController({
      httpResponsesHelper,
      updateUserProfileService,
    });
  };
