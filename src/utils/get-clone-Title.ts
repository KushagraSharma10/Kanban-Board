export const getNextCloneTitle = (
  originalTitle: string,
  existingTitles: string[]
): string => {
  const normalizedTitle = originalTitle.trim();

  const titleMatch = normalizedTitle.match(/^(.*?)(?:\s+(\d+))?$/);
  const baseName = titleMatch?.[1]?.trim() || normalizedTitle;
  const currentNumber = titleMatch?.[2] ? parseInt(titleMatch[2], 10) : 0;

  let highestNumber = 0;

  for (const existingTitle of existingTitles) {
    const existingMatch = existingTitle.match(/^(.*?)(?:\s+(\d+))?$/);
    const existingBase = existingMatch?.[1]?.trim() || existingTitle.trim();
    const existingNumber = existingMatch?.[2]
      ? parseInt(existingMatch[2], 10)
      : 0;

    if (existingBase.toLowerCase() === baseName.toLowerCase()) {
      highestNumber = Math.max(highestNumber, existingNumber);
    }
  }

  const nextNumber = Math.max(currentNumber, highestNumber) + 1;
  return `${baseName} ${nextNumber}`;
};
