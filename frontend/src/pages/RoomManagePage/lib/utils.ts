/**
 * Generates initials from a full name (up to 2 first letters).
 * Falls back to "U" when the name is empty.
 */
export function initials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}