import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { CreateUserService } from "@/backend/data/services";
import { HttpResponses } from "../../helpers/http-responses";
import { UserProps } from "@/backend/domain/entities";

interface CreateUserControllerProps {
  createUserService: CreateUserService;
  httpResponses: HttpResponses;
}

export class CreateUserController implements Controller {
  constructor(private readonly props: CreateUserControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProps>
  ): Promise<HttpResponse> => {
    const { createUserService, httpResponses } = this.props;

    try {
      const userProps = request.body;

      await createUserService.create(userProps);

      return httpResponses.created();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
