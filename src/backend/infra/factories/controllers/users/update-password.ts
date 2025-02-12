import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserPasswordController } from "@/backend/presentation/controllers";
import { makeUserUpdatePasswordService } from "../../services";

export const makeUpdateUserPasswordController =
  (): UpdateUserPasswordController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const userUpdatePasswordService = makeUserUpdatePasswordService();
    return new UpdateUserPasswordController({
      httpResponsesHelper,
      userUpdatePasswordService,
    });
  };
