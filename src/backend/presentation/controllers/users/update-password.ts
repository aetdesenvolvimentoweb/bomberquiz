import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UpdateUserPasswordService } from "@/backend/data/services";

interface UpdateUserPasswordControllerProps {
  updateUserPasswordService: UpdateUserPasswordService;
  httpResponses: HttpResponses;
}

export class UpdateUserPasswordController implements Controller {
  constructor(private readonly props: UpdateUserPasswordControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserPasswordProps>
  ): Promise<HttpResponse> => {
    const { updateUserPasswordService, httpResponses } = this.props;

    try {
      const { id, oldPassword, newPassword } = request.body;

      await updateUserPasswordService.updatePassword({
        id,
        oldPassword,
        newPassword,
      });

      return httpResponses.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
