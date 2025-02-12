import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserUpdatePasswordService } from "@/backend/data/services";

interface ConstructorProps {
  userUpdatePasswordService: UserUpdatePasswordService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserPasswordController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserPasswordProps>
  ): Promise<HttpResponse> => {
    const { userUpdatePasswordService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;
      const props = request.body;

      await userUpdatePasswordService.updatePassword({
        id,
        props,
      });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
