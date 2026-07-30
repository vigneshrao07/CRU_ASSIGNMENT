 import { Catalogue } from "../domain/Catalogue.js";
import { BuyNGetCheapestFreeOffer, BuyNGetMFreeOffer, PercentageDiscountOffer } from "../domain/offers.js";

export function createCatalogue() {
  return new Catalogue()
    .addProduct("Baked Beans", "0.99")
    .addProduct("Biscuits", "1.20")
    .addProduct("Sardines", "1.89")
    .addProduct("Shampoo (Small)", "2.50")
    .addProduct("Shampoo (Medium)", "3.0")
    .addProduct("Shampoo (Large)", "3.50");
}

export function createOffers() {
  return [
    new BuyNGetMFreeOffer("Baked Beans", { buy: 2, free: 2 }),
    new PercentageDiscountOffer("Sardines", 20),
    new BuyNGetCheapestFreeOffer(
      ["Shampoo (Small)", "Shampoo (Medium)", "Shampoo (Large)"],
      { groupSize: 3, freeCount: 1 }
    )
  ];
}