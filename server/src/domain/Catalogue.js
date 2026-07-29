import { poundsToPence, penceToPounds } from "./money.js";

export class Catalogue {
  #products = new Map();

  addProduct(name, price) {
    this.#products.set(name, poundsToPence(price));
  }

  getPricePence(name) {
    return this.#products.get(name);
  }

  getPrice(name) {
    return penceToPounds(this.getPricePence(name));
  }

  hasProduct(name) {
    return this.#products.has(name);
  }

  get size() {
    return this.#products.size;
  }
}