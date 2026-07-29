export function poundsToPence(value) {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError("Price must be a non-negative number or decimal string");
    }
    value = value.toString();
  }

  if (typeof value !== "string" || !/^\d+(\.\d+)?$/.test(value)) {
    throw new TypeError("Price must be a non-negative number or decimal string");
  }

  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction);
}

export function penceToPounds(pence) {
  return (pence / 100).toFixed(2);
}

export function roundFractionToPence(numerator, denominator) {
  return Math.round(numerator / denominator);
}