export const formatIsoToDateString = (isoTimestamp?: string | null): string | undefined => {
  if (!isoTimestamp) return undefined;

  const dateObject = new Date(isoTimestamp);
  
  if (isNaN(dateObject.getTime())) return undefined;

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateStringToIso = (dateString?: string): string | null => {
  if (!dateString) return null;

  const dateObject = new Date(dateString);
  if (isNaN(dateObject.getTime())) return null;

  return dateObject.toISOString();
};