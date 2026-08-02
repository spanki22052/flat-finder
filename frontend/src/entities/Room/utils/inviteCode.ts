// Group an invite code into the canonical FF format: AAAA-BBBB-CCCC.
// Tolerates user input that already has dashes or lowercase.
export function formatInviteCode(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (cleaned.length === 0) return '';
  const groups: string[] = [];
  for (let i = 0; i < cleaned.length; i += 4) {
    groups.push(cleaned.slice(i, i + 4));
  }
  return groups.join('-');
}
