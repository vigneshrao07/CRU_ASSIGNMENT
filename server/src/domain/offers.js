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

    const groupSize = this.buy + this.free;
    const completeGroups = Math.floor(quantity / groupSize);

    return (
      completeGroups *
      this.free *
      catalogue.getPricePence(this.product)
    );
  }
}

export class BuyNGetCheapestFreeOffer extends Offer {
  constructor(products, { groupSize, freeCount }) {
    if (!Number.isInteger(groupSize) || groupSize < 2) {
      throw new Error(`'groupSize' must be ≥ 2, got ${groupSize}`);
    }

    if (!Number.isInteger(freeCount) || freeCount < 1) {
      throw new Error(`'freeCount' must be ≥ 1, got ${freeCount}`);
    }

    if (freeCount >= groupSize) {
      throw new Error(
        `'freeCount' (${freeCount}) must be less than 'groupSize' (${groupSize})`
      );
    }

    super(products);
    this.groupSize = groupSize;
    this.freeCount = freeCount;
  }

  calculateDiscountPence(items, catalogue) {
    const prices = [];

    for (const product of this.applicableProducts) {
      const quantity = items[product] ?? 0;

      if (quantity > 0 && catalogue.hasProduct(product)) {
        prices.push(
          ...Array(quantity).fill(catalogue.getPricePence(product))
        );
      }
    }

    prices.sort((a, b) => a - b);

    let discount = 0;
    const completeGroups = Math.floor(prices.length / this.groupSize);

    for (let groupIndex = 0; groupIndex < completeGroups; groupIndex += 1) {
      const start = groupIndex * this.groupSize;
      const group = prices.slice(start, start + this.groupSize);

      discount += group
        .slice(-this.freeCount)
        .reduce((sum, price) => sum + price, 0);
    }

    return discount;
  }
}