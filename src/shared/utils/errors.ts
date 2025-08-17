export type ErrorLike = {
  message?: unknown;
  response?: { data?: { message?: unknown } };
};

export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === 'object' && err !== null) {
    const e = err as ErrorLike;
    const fromResponse = e.response?.data?.message;
    if (typeof fromResponse === 'string') return fromResponse;
    if (typeof e.message === 'string') return e.message;
  }
  return fallback;
};
