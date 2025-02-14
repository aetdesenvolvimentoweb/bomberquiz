import { AuthLoginController } from "@/backend/presentation/controllers";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { makeAuthLoginService } from "../../services";

export const makeAuthLoginController = (): AuthLoginController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const authLoginService = makeAuthLoginService();
  return new AuthLoginController({
    httpResponsesHelper,
    authLoginService,
  });
};
