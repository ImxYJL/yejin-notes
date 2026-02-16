export type PaginationMeta = {
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationParams = {
  page: number;
  limit?: number;
};
