export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  windowSize: number = 5,
) => {
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 현재 페이지를 중심으로 앞뒤 범위를 계산
  let start = Math.max(currentPage - Math.floor(windowSize / 2), 1);
  let end = start + windowSize - 1;

  // 끝 범위가 전체 페이지를 넘어가면 조정
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - windowSize + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};
