 import { penceToPounds } from "./money.js";

export class BasketPricer {
  price(basket, catalogue, offers = []) {
    const items = basket.items;
    let subTotalPence = 0;

    for (const [product, quantity] of Object.entries(items)) {
      if (!catalogue.hasProduct(product)) {
        throw new Error(
          `Product '${product}' is in the basket but not in the catalogue`
        );
      }

      subTotalPence += catalogue.getPricePence(product) * quantity;
    }

    const discountPence = (offers ?? []).reduce(
      (sum, offer) =>
        sum + offer.calculateDiscountPence(items, catalogue),
      0
    );

    const totalPence = subTotalPence - discountPence;

    return {
      subTotal: penceToPounds(subTotalPence),
      discount: penceToPounds(discountPence),
      total: penceToPounds(totalPence)
    };
  }
}