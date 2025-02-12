import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserUpdateProfileService } from "@/backend/data/services";

interface ConstructorProps {
  userUpdateProfileService: UserUpdateProfileService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserProfileController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProfileProps>
  ): Promise<HttpResponse> => {
    const { userUpdateProfileService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id = request.dynamicParams.id;
      const props = request.body;

      await userUpdateProfileService.updateProfile({ id, props });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
