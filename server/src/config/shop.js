import { Catalogue } from "../domain/Catalogue.js";

export function createCatalogue() {
  return new Catalogue()
    .addProduct("Baked Beans", "0.99")
    .addProduct("Biscuits", "1.20")
    .addProduct("Sardines", "1.89")
    .addProduct("Shampoo (Small)", "2.50")
    .addProduct("Shampoo (Medium)", "3.0")
    .addProduct("Shampoo (Large)", "3.50");
}