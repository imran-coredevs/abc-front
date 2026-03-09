/**
 * Shortens a public key / address into a compact human-friendly form.
 * Examples:
 *   formatPublicKey('0xA83fB2C3D4E5F67890123456789092C1') -> '0xA83fB2...92C1'
 *   formatPublicKey('A83fB2C3D4E5F67890123456789092C1', 4, 4) -> 'A83f...92C1'
 */
export function formatPublicKey(
  pk?: string | null,
  leading = 6,
  trailing = 4
): string {
  if (!pk) return ''

  const str = pk.trim()
  // If the string already looks shortened, return as-is
  if (str.includes('...')) return str

  const has0x = str.toLowerCase().startsWith('0x')
  const body = has0x ? str.slice(2) : str

  // If body is too short to shorten, return original
  if (body.length <= leading + trailing) {
    // return original formatting (keep 0x if present)
    return str
  }

  const start = body.slice(0, leading)
  const end = body.slice(-trailing)
  return (has0x ? '0x' : '') + start + '...' + end
}
