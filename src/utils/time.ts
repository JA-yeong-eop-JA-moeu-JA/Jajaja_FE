type TFormatOption = 'default' | 'short';

export const formatKoreanDateLabel = (isoString?: string, mode: TFormatOption = 'default'): string => {
  if (!isoString) return mode === 'default' ? '- 기준' : '-';

  const date = new Date(isoString);

  if (mode === 'short') {
    const YY = String(date.getFullYear()).slice(2);
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    return `${YY}.${MM}.${DD}.`;
  }

  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${MM}.${DD}. ${HH}:${mm} 기준`;
};
