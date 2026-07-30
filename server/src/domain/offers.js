import { roundFractionToPence } from "./money.js";

export class Offer {
  constructor(applicableProducts) {
    this.applicableProducts = applicableProducts;
  }

  calculateDiscountPence() {
    return 0;
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

    const price = catalogue.getPricePence(this.product);
    return Math.round((price * quantity * this.percentage) / 100);
  }
}