import { penceToPounds } from "./money.js";

export class BasketPricer {
  price(basket, catalogue) {
    const items = basket.items;
    let subTotalPence = 0;

    for (const [product, quantity] of Object.entries(items)) {
      subTotalPence += catalogue.getPricePence(product) * quantity;
    }

    return {
      subTotal: penceToPounds(subTotalPence),
      discount: 0,
      total: penceToPounds(subTotalPence)
    };
  }
}