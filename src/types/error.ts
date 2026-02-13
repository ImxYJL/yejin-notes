export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION"
  | "DUPLICATE"
  | "NOT_FOUND"
  | "RATE_LIMIT"
  | "INTERNAL";

export type AppErrorResponse = {
  success: false;
  code: AppErrorCode;
  message: string;
  status: number;
};
