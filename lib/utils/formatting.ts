/** Parse an Instagram URL or bare username and return the username */
export function parseUsername(input: string): string {
  const trimmed = input.trim().replace(/\/$/, '');
  const match = trimmed.match(/instagram\.com\/([^/?#]+)/);
  if (match) return match[1].toLowerCase();
  return trimmed.replace('@', '').toLowerCase();
}

/** Validate that a string looks like a valid IG username */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9._]{1,30}$/.test(username);
}
