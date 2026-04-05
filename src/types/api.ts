export interface ApiResponse<T> { data: T; cached?: boolean; error?: string; }
export interface PaginatedResponse<T> extends ApiResponse<T[]> { total: number; page: number; pageSize: number; }
export interface ApiError { error: string; code: string; statusCode: number; }
