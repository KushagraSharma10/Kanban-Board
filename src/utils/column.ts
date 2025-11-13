import { MAX_COLUMN_NAME_LENGTH } from "./constants/column";

export const validateColumnTitle = (
  titleRaw: string,
  existingTitles: string[],
  _excludeId?: string,
): { isValid: boolean; title: string; error?: string } => {
  const title = titleRaw.trim();

  if (!title) {
    return { isValid: false, title, error: "Title cannot be empty." };
  }
  if (title.length < 2) {
    return { isValid: false, title, error: "Title must be at least 2 characters." };
  }
  if (title.length > MAX_COLUMN_NAME_LENGTH) {
    return {
      isValid: false,
      title,
      error: `Title cannot exceed ${MAX_COLUMN_NAME_LENGTH} characters.`,
    };
  }

  const normalized = title.toLowerCase();
  const hasDuplicate = existingTitles.some(
    (existing) => existing.toLowerCase() === normalized
  );

  if (hasDuplicate) {
    return { isValid: false, title, error: "Column title already exists." };
  }

  return { isValid: true, title };
};
