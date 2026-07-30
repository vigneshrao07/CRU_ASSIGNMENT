 export class Basket {
  #items = new Map();

  add(productName, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(
        `Quantity must be a positive integer, got ${quantity}`
      );
    }

    this.#items.set(
      productName,
      (this.#items.get(productName) ?? 0) + quantity
    );

    return this;
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