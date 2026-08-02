/**
 * Generates initials from a full name (up to 2 first letters).
 * Falls back to "U" when the name is empty.
 */
export function initialsOf(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/**
 * Deterministic hue index (0-5) from a user ID string.
 * Used to pick avatar gradient tone.
 */
export function avatarTone(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) | 0;
  return Math.abs(h % 6);
}

/**
 * Russian pluralization for "человек" (one/few/many).
 */
export function pluralPeople(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return 'человек';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'человека';
  return 'человек';
}