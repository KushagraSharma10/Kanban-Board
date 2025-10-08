export const loadFromStorage = (key: string, defaultValue: unknown) => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save data:", error);
  }
}
