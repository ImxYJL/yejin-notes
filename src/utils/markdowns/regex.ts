// TODO: 마크다운 관련 정규식들 이리로 가져오기

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
