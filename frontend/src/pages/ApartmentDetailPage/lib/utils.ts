/**
 * Format Russian phone "+79829114120" → "+7 982 911-41-20".
 * Returns the original string if it doesn't match the expected format.
 */
export function formatPhone(phone: string): string {
  const m = /^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  if (!m) return phone;
  return `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}`;
}