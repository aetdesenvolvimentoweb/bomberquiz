import { makeUserCreateController } from "@/backend/infra/factories/controllers/user/make-user-create-controller";
import { UserCreateController } from "@/backend/presentation/controllers";
import { ConsoleLogger } from "@/backend/infra/providers";
import * as factories from "@/backend/infra/factories";

// Mock dependencies
jest.mock("@/backend/presentation/controllers");
jest.mock("@/backend/infra/providers");
jest.mock("@/backend/infra/factories");

describe("makeUserCreateController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create and return a UserCreateController instance with correct dependencies", () => {
    // Mock implementations
    const mockUserCreateService = { execute: jest.fn() };
    const mockLoggerProvider = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
    };

    // Setup mocks
    (ConsoleLogger as jest.Mock).mockImplementation(() => mockLoggerProvider);
    (factories.makeUserCreateService as jest.Mock).mockReturnValue(
      mockUserCreateService,
    );
    (UserCreateController as jest.Mock).mockImplementation(
      ({ userCreateService, loggerProvider }) => ({
        userCreateService,
        loggerProvider,
        handle: jest.fn(),
      }),
    );

    // Call the factory function
    const controller = makeUserCreateController();

    // Assertions
    expect(ConsoleLogger).toHaveBeenCalledTimes(1);
    expect(factories.makeUserCreateService).toHaveBeenCalledWith(
      mockLoggerProvider,
    );
    expect(UserCreateController).toHaveBeenCalledWith({
      userCreateService: mockUserCreateService,
      loggerProvider: mockLoggerProvider,
    });

    // Verify the controller was created with correct dependencies
    expect(controller).toHaveProperty(
      "userCreateService",
      mockUserCreateService,
    );
    expect(controller).toHaveProperty("loggerProvider", mockLoggerProvider);
    expect(controller).toHaveProperty("handle");
  });
});
