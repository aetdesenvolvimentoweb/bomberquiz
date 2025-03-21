import { InMemoryUserRepository } from "@/backend/data/repositories";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { LoggerProvider } from "@/backend/domain/providers";
import {
  DateFnsBirthdateValidatorAdapter,
  LibphonenumberPhoneValidator,
  PasswordValidatorAdapter,
  ValidatorEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { Argon2Hash } from "@/backend/infra/providers";
import { DOMPurifyXssSanitizer } from "@/backend/infra/sanitizers";

/**
 * Factory function that creates and configures a UserCreateService with all necessary dependencies.
 *
 * This factory handles the complex dependency graph required by the UserCreateService, including:
 * - Security providers (password hashing, XSS sanitization)
 * - Data validators (birthdate, email, password, phone)
 * - Domain-specific validators (unique email)
 * - Data repositories
 * - Data sanitizers
 *
 * Using this factory centralizes the creation logic and simplifies service instantiation
 * throughout the application.
 *
 * @param {LoggerProvider} loggerProvider - The logger implementation to be injected into the service
 * @returns {UserCreateService} A fully configured UserCreateService instance ready for use
 *
 * @example
 * // Create a user service with console logging
 * const logger = new ConsoleLogger();
 * const userService = makeUserCreateService(logger);
 *
 * // Use the service to create a new user
 * await userService.create({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "SecurePassword123!",
 *   phone: "+1234567890",
 *   birthdate: new Date("1990-01-01")
 * });
 */
export const makeUserCreateService = (
  loggerProvider: LoggerProvider,
): UserCreateService => {
  const hashProvider = new Argon2Hash();
  const xssSanitizer = new DOMPurifyXssSanitizer();
  const userCreateDataSanitizer = new UserCreateDataSanitizer(xssSanitizer);
  const userRepository = new InMemoryUserRepository();
  const userBirthdateValidator = new DateFnsBirthdateValidatorAdapter();
  const userEmailValidator = new ValidatorEmailValidatorAdapter();
  const userPasswordValidator = new PasswordValidatorAdapter();
  const userPhoneValidator = new LibphonenumberPhoneValidator();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });

  return new UserCreateService({
    hashProvider,
    loggerProvider,
    userCreateDataSanitizer,
    userRepository,
    userCreateDataValidator,
  });
};
