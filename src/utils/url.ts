type QueryValue = string | number | boolean | null | undefined;

export const createUrl = (pathname: string, query?: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
};
