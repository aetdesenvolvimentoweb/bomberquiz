import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserPasswordController } from "@/backend/presentation/controllers";
import { makeUpdateUserPasswordService } from "../../services";

export const makeUpdateUserPasswordController =
  (): UpdateUserPasswordController => {
    const httpResponsesHelper = new HttpResponsesHelper();
    const updateUserPasswordService = makeUpdateUserPasswordService();
    return new UpdateUserPasswordController({
      httpResponsesHelper,
      updateUserPasswordService,
    });
  };
