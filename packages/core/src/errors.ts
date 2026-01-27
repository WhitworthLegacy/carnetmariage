export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PLAN_LIMIT_REACHED"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export interface AppError {
  code: ErrorCode;
  message: string;
  requestId?: string;
}

export function makeError(code: ErrorCode, message: string, requestId?: string): AppError {
  return { code, message, requestId };
}
