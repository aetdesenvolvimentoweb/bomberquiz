import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserProfile } from "@/backend/domain/entities";

interface UpdateUserProfileControllerProps {
  updateUserProfileService: UpdateUserProfileService;
  httpResponses: HttpResponses;
}

export class UpdateUserProfileController implements Controller {
  constructor(private readonly props: UpdateUserProfileControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProfile>
  ): Promise<HttpResponse> => {
    const { updateUserProfileService, httpResponses } = this.props;

    try {
      const userProfile = request.body;

      await updateUserProfileService.updateProfile(userProfile);

      return httpResponses.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
