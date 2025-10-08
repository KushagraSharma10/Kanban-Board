export const normalizeBoardName = (name: string) =>
  name.trim().split(" ").filter(Boolean).join(" ").toLowerCase();
