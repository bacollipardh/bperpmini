export function buildDocNo(prefix: string, nextNumber: number) {
  return `${prefix}${String(nextNumber).padStart(6, '0')}`;
}
