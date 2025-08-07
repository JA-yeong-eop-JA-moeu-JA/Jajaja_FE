export const formatKoreanDateLabel = (isoString?: string): string => {
  if (!isoString) {
    return '- 기준';
  }
  const date = new Date(isoString);

  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${MM}.${DD}. ${HH}:${mm} 기준`;
};
