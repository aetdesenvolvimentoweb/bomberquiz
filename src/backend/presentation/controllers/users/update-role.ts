import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserRole } from "@/backend/domain/entities";
import { UserUpdateRoleService } from "@/backend/data/services";

interface ConstructorProps {
  userUpdateRoleService: UserUpdateRoleService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserRoleController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<{ role: UserRole }>
  ): Promise<HttpResponse> => {
    const { userUpdateRoleService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;
      const role = request.body.role;

      await userUpdateRoleService.updateRole({ id, role });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
