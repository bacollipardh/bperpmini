export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
