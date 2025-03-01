import {
  BcryptHashProvider,
  ConsoleLoggerProvider,
} from "@/backend/infra/providers";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { NextRequest, NextResponse } from "next/server";
import {
  UserCreateDataValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { DateFnsUserBirthdateValidatorAdapter } from "@/backend/infra/adapters";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateController } from "@/backend/presentation/controllers";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateRequestValidator } from "@/backend/presentation/validators";
import { UserCreateService } from "@/backend/data/services";

const handler = async (request: NextRequest): Promise<NextResponse> => {
  switch (request.method) {
    case "POST":
      const loggerProvider = new ConsoleLoggerProvider();
      const userCreateRequestValidator = new UserCreateRequestValidator(
        loggerProvider,
      );
      const hashProvider = new BcryptHashProvider();
      const repository = new InMemoryUserRepository();
      const sanitizer = new UserCreateDataSanitizer();
      const userBirthdateValidator = new DateFnsUserBirthdateValidatorAdapter();
      const userEmailValidator = new ValidatorUserEmailValidatorAdapter();
      const userPasswordValidator = new UserPasswordValidator();
      const userPhoneValidator = new LibPhoneNumberUserPhoneValidatorAdapter();
      const userUniqueEmailValidator = new UserUniqueEmailValidator(repository);
      const validator = new UserCreateDataValidator({
        userBirthdateValidator,
        userEmailValidator,
        userPasswordValidator,
        userPhoneValidator,
        userUniqueEmailValidator,
      });
      const userCreateService = new UserCreateService({
        loggerProvider,
        hashProvider,
        repository,
        sanitizer,
        validator,
      });
      const controller = new UserCreateController({
        loggerProvider,
        userCreateRequestValidator,
        userCreateService,
      });
      const body = await request.json();

      const httpRequest: HttpRequest<UserCreateData> = {
        body,
      };

      await controller.handle(httpRequest);

      return NextResponse.json<HttpResponse>({
        body: {
          success: true,
          metadata: { timestamp: new Date().toISOString() },
        },
        statusCode: 201,
      });

    default:
      return NextResponse.json<HttpResponse>({
        body: {
          success: false,
          errorMessage: "Método não autorizado",
          metadata: { timestamp: new Date().toISOString() },
        },
        statusCode: 405,
      });
  }
};

export { handler as POST };
