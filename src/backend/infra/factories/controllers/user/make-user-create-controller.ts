import { UserCreateController } from "@/backend/presentation/controllers";
import { Controller } from "@/backend/presentation/protocols";
import { makeUserCreateService } from "@/backend/infra/factories";
import { ConsoleLogger } from "@/backend/infra/providers";

/**
 * Factory function to create a new UserCreateController instance.
 *
 * This factory encapsulates the creation logic for the UserCreateController,
 * instantiating all required dependencies:
 * - ConsoleLogger as the logging provider
 * - UserCreateService (via its own factory)
 *
 * The factory pattern is used to abstract the complexity of object creation
 * and allows for better testability and dependency injection.
 *
 * @returns {Controller} A configured UserCreateController instance implementing the Controller interface
 *
 * @example
 * // Create a new controller instance
 * const userCreateController = makeUserCreateController();
 * // Use the controller in a route handler
 * app.post('/users', adaptRoute(userCreateController));
 */
export const makeUserCreateController = (): Controller => {
  const loggerProvider = new ConsoleLogger();
  const userCreateService = makeUserCreateService(loggerProvider);
  return new UserCreateController({
    userCreateService,
    loggerProvider,
  });
};
