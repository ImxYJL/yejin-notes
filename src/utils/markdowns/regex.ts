/**
 * <br> 태그를 줄바꿈으로 변환 (react-markdown용 전처리)
 */
export const normalizeBreaks = (content: string): string =>
  content.replace(/<br\s*\/?>/gi, '\n');

/**
 * 본문 마크다운에서 요약문 추출
 */
export const extractSummary = (content: string, length = 150): string => {
  if (!content) return '';

  return (
    content
      .replace(/[#*`>_~]/g, '')
      .replace(/[!image]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\s+/g, ' ')
      .slice(0, length)
      .trim()
  );
};

/**
 * 본문 마크다운에서 모든 이미지 URL을 추출
 */
export const extractImages = (content: string): string[] => {
  const IMAGE_REGEX = /!\[.*?\]\((.*?)\)/g;
  const matches = [...content.matchAll(IMAGE_REGEX)];

  return matches.map((match) => match[1]);
};

/**
 * 본문 마크다운에서 첫 번째 이미지 URL을 추출하여 자동 썸네일 후보로 반환
 */
export const getThumbnail = (content: string): string | null => {
  const images = extractImages(content);
  return images.length > 0 ? images[0] : null;
};
