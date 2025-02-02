import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UpdateUserPasswordService } from "@/backend/data/services";

interface ConstructorProps {
  updateUserPasswordService: UpdateUserPasswordService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserPasswordController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserPasswordProps>
  ): Promise<HttpResponse> => {
    const { updateUserPasswordService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;
      const props = request.body;

      await updateUserPasswordService.updatePassword({
        id,
        props,
      });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
