export class Basket {
  #items = new Map();

  add(productName, quantity = 1) {
    this.#items.set(productName, quantity);
  }

  get items() {
    return Object.fromEntries(this.#items);
  }

  get isEmpty() {
    return this.#items.size === 0;
  }

  has(productName) {
    return this.#items.has(productName);
  }
}