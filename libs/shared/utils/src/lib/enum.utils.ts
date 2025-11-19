export function enumToArray<T extends Record<string, string>>(
  enumObj: T
): { label: string; value: string }[] {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: capitalizeFirstLetter(key.toLowerCase()),
    value,
  }));
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
