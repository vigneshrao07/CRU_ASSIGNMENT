 import { poundsToPence, penceToPounds } from "./money.js";

export class Catalogue {
  #products = new Map();

  addProduct(name, price) {
    this.#products.set(name, poundsToPence(price));
    return this;
  }

  getPricePence(name) {
    if (!this.#products.has(name)) {
      throw new Error(`Product '${name}' is not in the catalogue`);
    }

    return this.#products.get(name);
  }

  getPrice(name) {
    return penceToPounds(this.getPricePence(name));
  }

  hasProduct(name) {
    return this.#products.has(name);
  }

  get products() {
    return Object.fromEntries(this.#products);
  }

  get size() {
    return this.#products.size;
  }
}