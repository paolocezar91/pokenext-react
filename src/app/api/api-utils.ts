export interface ResultsCount<T> {
  count: number;
  results: T[];
}

export const idOrName = (idOrName: string) => {
  const isId = !isNaN(Number(idOrName));
  const name = isId ? "" : idOrName;
  const id = isId ? Number(idOrName) : undefined;

  return { name, id };
};

export const formatResultsCount = <T>(results: T[]) => {
  return {
    count: results.length,
    results,
  } as ResultsCount<T>;
};
