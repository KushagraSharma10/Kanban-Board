export type ApiListEnvelope<T> = { success?: boolean; data: T[] } | T[];
export type ApiOneEnvelope<T>  = { success?: boolean; data: T } | T;

export const unwrapList = <T>(payload: ApiListEnvelope<T>): T[] =>
  Array.isArray(payload) ? payload : payload.data;

export const unwrapOne = <T>(payload: ApiOneEnvelope<T>): T =>
  (payload as { data?: T }).data ?? (payload as T);
