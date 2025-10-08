export function getNextCloneTitle(baseTitle: string, siblingTitles: string[]): string {
  const trimmedTitle = baseTitle.trim();
  const match = trimmedTitle.match(/^(.*?)(?:\s+(\d+))?$/);

  const base = match?.[1]?.trim() || trimmedTitle; 
  const existingNumber = match?.[2] ? parseInt(match[2], 10) : 0; 

  let maxNumber = 0;

  for (const sibling of siblingTitles) {
    const siblingMatch = sibling.match(/^(.*?)(?:\s+(\d+))?$/);
    const siblingBase = siblingMatch?.[1]?.trim() || sibling.trim();
    const siblingNumber = siblingMatch?.[2] ? parseInt(siblingMatch[2], 10) : 0;

    if (siblingBase.toLowerCase() === base.toLowerCase()) {
      maxNumber = Math.max(maxNumber, siblingNumber);
    }
  }

  const nextNumber = Math.max(existingNumber, maxNumber) + 1;
  return `${base} ${nextNumber}`;
}
