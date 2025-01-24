import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";
import { UpdateUserRoleProps } from "@/backend/domain/entities";
import { UpdateUserRoleService } from "@/backend/data/services";

interface UpdateUserRoleControllerProps {
  updateUserRoleService: UpdateUserRoleService;
  httpResponses: HttpResponses;
}

export class UpdateUserRoleController implements Controller {
  constructor(private readonly props: UpdateUserRoleControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserRoleProps>
  ): Promise<HttpResponse> => {
    const { updateUserRoleService, httpResponses } = this.props;

    try {
      const updateUserRoleProps = request.body;

      await updateUserRoleService.updateRole(updateUserRoleProps);

      return httpResponses.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
