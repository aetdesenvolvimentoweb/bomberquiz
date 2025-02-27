import { DatabaseError } from "../database.error";

describe("DatabaseError", () => {
  it("should create an error with the provided message", () => {
    const message = "Database connection failed";
    const error = new DatabaseError(message);

    expect(error.message).toBe(message);
  });

  it("should create a database error with status code 500", () => {
    const error = new DatabaseError("Database connection failed");

    expect(error.statusCode).toBe(500);
  });
});
