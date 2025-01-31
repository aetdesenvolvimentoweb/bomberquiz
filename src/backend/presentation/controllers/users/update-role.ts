import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserRoleProps } from "@/backend/domain/entities";
import { UpdateUserRoleService } from "@/backend/data/services";

interface UpdateUserRoleControllerProps {
  updateUserRoleService: UpdateUserRoleService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserRoleController implements Controller {
  constructor(private readonly props: UpdateUserRoleControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserRoleProps>
  ): Promise<HttpResponse> => {
    const { updateUserRoleService, httpResponsesHelper } = this.props;

    try {
      console.log("body", request.body);
      const id: string = request.dynamicParams.id;
      const updateUserRoleProps = { ...request.body, id };

      await updateUserRoleService.updateRole(updateUserRoleProps);

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
