import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserProfile } from "@/backend/domain/entities";

interface UpdateUserProfileControllerProps {
  updateUserProfileService: UpdateUserProfileService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserProfileController implements Controller {
  constructor(private readonly props: UpdateUserProfileControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProfile>
  ): Promise<HttpResponse> => {
    const { updateUserProfileService, httpResponsesHelper } = this.props;

    try {
      const userProfile = request.body;

      await updateUserProfileService.updateProfile(userProfile);

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
