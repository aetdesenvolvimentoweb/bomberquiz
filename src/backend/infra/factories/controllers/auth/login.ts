import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { LoginController } from "@/backend/presentation/controllers";
import { makeLoginService } from "../../services";

export const makeLoginController = (): LoginController => {
  const httpResponsesHelper = new HttpResponsesHelper();
  const loginService = makeLoginService();
  return new LoginController({
    httpResponsesHelper,
    loginService,
  });
};
