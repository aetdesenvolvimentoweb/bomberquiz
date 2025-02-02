import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { CreateUserService } from "@/backend/data/services";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UserProps } from "@/backend/domain/entities";

interface ConstructorProps {
  createUserService: CreateUserService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class CreateUserController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProps>
  ): Promise<HttpResponse> => {
    const { createUserService, httpResponsesHelper } = this.constructorProps;

    try {
      const userProps = request.body;

      await createUserService.create(userProps);

      return httpResponsesHelper.created();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
