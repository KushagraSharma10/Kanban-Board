export const getErrorMessage = (value: unknown): string => {
  const maybeAxios = value as { response?: { data?: { message?: string } } };
  if (maybeAxios?.response?.data?.message) return maybeAxios.response.data.message;
  if (value instanceof Error) return value.message;
  return "Request failed";
};