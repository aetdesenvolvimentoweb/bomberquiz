import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UpdateUserPasswordService } from "@/backend/data/services";

interface UpdateUserPasswordControllerProps {
  updateUserPasswordService: UpdateUserPasswordService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserPasswordController implements Controller {
  constructor(private readonly props: UpdateUserPasswordControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UpdateUserPasswordProps>
  ): Promise<HttpResponse> => {
    const { updateUserPasswordService, httpResponsesHelper } = this.props;

    try {
      console.log("request completo", request);
      const id: string = request.dynamicParams.id;
      const updateUserPasswordProps = { ...request.body, id };
      console.log(
        "controller updateUserPasswordProps",
        updateUserPasswordProps
      );

      await updateUserPasswordService.updatePassword(updateUserPasswordProps);

      return httpResponsesHelper.noContent();
    } catch (error) {
      console.log("error", error);
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
