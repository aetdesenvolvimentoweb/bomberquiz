import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserProfileProps } from "@/backend/domain/entities";

interface ConstructorProps {
  updateUserProfileService: UpdateUserProfileService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserProfileController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProfileProps>
  ): Promise<HttpResponse> => {
    const { updateUserProfileService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id = request.dynamicParams.id;
      const props = request.body;

      await updateUserProfileService.updateProfile({ id, props });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
