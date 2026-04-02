type DateSeparator = '/' | '-' | '.' | ' ';

/**
 * 날짜 문자열을 받아 지정된 구분자로 변환합니다.
 * @param dateStr - DB에서 내려온 날짜 데이터 (ISO 8601 등)
 * @param separator - 날짜 사이의 구분자 (기본값: "/")
 * @returns 'YYYY/MM/DD' 형식의 문자열
 */
export const formatDate = (
  dateStr: string | Date,
  separator: DateSeparator = '/',
): string => {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${day}`;
};
