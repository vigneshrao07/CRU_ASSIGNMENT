 import { roundFractionToPence } from "./money.js";

export class Offer {
  constructor(applicableProducts) {
    if (!applicableProducts || applicableProducts.length === 0) {
      throw new Error("An offer must apply to at least one product");
    }

    this.applicableProducts = Object.freeze([...new Set(applicableProducts)]);
  }

  calculateDiscountPence() {
    throw new Error("calculateDiscountPence must be implemented");
  }
}

export class PercentageDiscountOffer extends Offer {
  constructor(product, percentage) {
    if (typeof percentage !== "number" || percentage < 0 || percentage > 100) {
      throw new Error(`Percentage must be between 0 and 100, got ${percentage}`);
    }

    super([product]);
    this.product = product;
    this.percentage = percentage;
  }

  calculateDiscountPence(items, catalogue) {
    const quantity = items[this.product] ?? 0;

    if (quantity === 0 || !catalogue.hasProduct(this.product)) {
      return 0;
    }

    const numerator =
      catalogue.getPricePence(this.product) *
      quantity *
      this.percentage;

    return roundFractionToPence(numerator, 100);
  }
}

export class BuyNGetMFreeOffer extends Offer {
  constructor(product, { buy, free }) {
    if (!Number.isInteger(buy) || buy < 1) {
      throw new Error(`'buy' must be ≥ 1, got ${buy}`);
    }

    if (!Number.isInteger(free) || free < 1) {
      throw new Error(`'free' must be ≥ 1, got ${free}`);
    }

    super([product]);
    this.product = product;
    this.buy = buy;
    this.free = free;
  }

  calculateDiscountPence(items, catalogue) {
    const quantity = items[this.product] ?? 0;

    if (quantity === 0 || !catalogue.hasProduct(this.product)) {
      return 0;
    }

    const completeGroups = Math.floor(quantity / this.buy);

    return (
      completeGroups *
      this.free *
      catalogue.getPricePence(this.product)
    );
  }
}