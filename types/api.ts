export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  details?: string;
  timestamp: number;
  data?: T;
}
