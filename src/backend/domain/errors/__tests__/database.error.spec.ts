import { DatabaseError } from "../database.error";

describe("DatabaseError", () => {
  it("should create an error with the provided message", () => {
    const message = "Database connection failed";
    const error = new DatabaseError(message);

    expect(error.message).toBe(message);
  });
});
