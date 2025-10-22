import { ApiResponse } from "@/types";

export function createApiResponse<T>(success: boolean, data?: T, error?: string, details?: string): ApiResponse<T> {
  return {
    success,
    data,
    error,
    details,
    timestamp: Date.now(),
  };
}
