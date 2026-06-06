export const MYPAGE_PAGE_SIZE = 10;

export type MypagePaginationOptions = {
  page?: number;
  pageSize?: number;
};

export type MypagePaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalPages: number;
};

export function resolveMypagePagination(options?: MypagePaginationOptions) {
  const pageSize = options?.pageSize ?? MYPAGE_PAGE_SIZE;
  const page = Math.max(1, options?.page ?? 1);
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

export function buildMypagePaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): MypagePaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page < totalPages,
    totalPages,
  };
}

export function paginateArray<T>(
  items: T[],
  options?: MypagePaginationOptions,
): MypagePaginatedResult<T> {
  const { page, pageSize, offset } = resolveMypagePagination(options);
  const slice = items.slice(offset, offset + pageSize);

  return buildMypagePaginatedResult(slice, items.length, page, pageSize);
}

export function parseMypagePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}
