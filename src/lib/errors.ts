export class AppError extends Error { constructor(message: string, public code: string, public statusCode: number = 500) { super(message); this.name = "AppError"; } }
export class ValidationError extends AppError { constructor(message: string) { super(message, "VALIDATION_ERROR", 400); this.name = "ValidationError"; } }
export class AuthorizationError extends AppError { constructor(message: string = "Unauthorized") { super(message, "UNAUTHORIZED", 401); this.name = "AuthorizationError"; } }
export class NotFoundError extends AppError { constructor(resource: string) { super(resource + " not found", "NOT_FOUND", 404); this.name = "NotFoundError"; } }
export class RateLimitError extends AppError { constructor() { super("Rate limit exceeded", "RATE_LIMITED", 429); this.name = "RateLimitError"; } }
export class ContractError extends AppError { constructor(message: string) { super(message, "CONTRACT_ERROR", 502); this.name = "ContractError"; } }
