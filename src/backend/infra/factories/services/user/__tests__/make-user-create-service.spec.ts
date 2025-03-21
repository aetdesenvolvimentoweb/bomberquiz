import { makeUserCreateService } from "@/backend/infra/factories/services/user/make-user-create-service";
import { UserCreateService } from "@/backend/data/services";
import { LoggerProvider } from "@/backend/domain/providers";

describe("makeUserCreateService", () => {
  it("should create and return a UserCreateService instance", () => {
    // Create a mock for the LoggerProvider
    const mockLoggerProvider: LoggerProvider = {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      trace: jest.fn(),
      withContext: jest.fn(),
    };

    // Call the factory function
    const userCreateService = makeUserCreateService(mockLoggerProvider);

    // Assert that the factory returns the correct instance
    expect(userCreateService).toBeInstanceOf(UserCreateService);

    // Optionally, you can also check if the logger was properly injected
    // by triggering a method that would use the logger and checking if it was called
    // For example, if UserCreateService has a method that logs:
    // userCreateService.someMethodThatLogs();
    // expect(mockLoggerProvider.info).toHaveBeenCalled();
  });
});
