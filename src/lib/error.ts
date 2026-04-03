/**
 * Custom error class for application-level errors.
 * Used to throw errors with a specific HTTP status code and message.
 *
 * @example
 * throw new AppError(404, "User not found");
 * throw new AppError(409, "Username already taken");
 */
export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}
