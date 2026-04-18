export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export function resolvePagination(query: PaginationQuery) {
  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
