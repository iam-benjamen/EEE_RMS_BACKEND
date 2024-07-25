interface ApiResponse<T> {
  status: boolean;
  message: string;
  data?: T;
}

export function formatResponse<T>(
  status: boolean,
  message: string,
  data?: T
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    status,
    message,
  };

  if (data !== undefined && data !== null) {
    response.data = data;
  }

  return response;
}
