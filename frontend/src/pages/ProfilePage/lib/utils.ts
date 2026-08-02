/**
 * Generates initials from a full name (up to 2 first letters).
 */
export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/**
 * Deterministic hue index (0-3) from a user ID string.
 * Used to pick avatar background tone.
 */
export function avatarTone(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i) * 17) | 0;
  return Math.abs(h % 4);
}

/**
 * Days elapsed since an ISO timestamp.
 */
export function daysSince(iso: string): number {
  const d = new Date(iso);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86_400_000));
}

/**
 * Inline mono font stack for use inside JSX without importing the full theme.
 */
export function themeMono(): string {
  return "'JetBrains Mono', 'Fira Code', monospace";
}

/**
 * Copy text to clipboard. Shows AntD toast on success/failure.
 * Dynamically imports antd to keep the initial chunk lean.
 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    const { message } = await import('antd');
    message.success('Скопировано');
  } catch {
    const { message } = await import('antd');
    message.error('Не удалось скопировать');
  }
}
