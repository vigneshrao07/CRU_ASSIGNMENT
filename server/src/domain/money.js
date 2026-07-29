export function poundsToPence(value) {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) throw new TypeError("Price must be a non-negative number or decimal string");
    value = value.toString();
  }
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value)) {
    throw new TypeError("Price must be a non-negative number or decimal string with at most 2 decimal places");
  }
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

export function penceToPounds(pence) {
  return Number((pence / 100).toFixed(2));
}

export function roundFractionToPence(numerator, denominator) {
  return Math.floor((numerator * 2 + denominator) / (2 * denominator));
}