 import test from "node:test";
import assert from "node:assert/strict";
import {
  Basket, Catalogue, BasketPricer,
  PercentageDiscountOffer, BuyNGetMFreeOffer, BuyNGetCheapestFreeOffer
} from "../src/domain/index.js";
import { createCatalogue, createOffers } from "../src/config/shop.js";

const pricer = new BasketPricer();

// Basket tests
test("Basket adds a single item", () => {
  const basket = new Basket().add("Baked Beans");
  assert.deepEqual(basket.items, { "Baked Beans": 1 });
});
test("Basket adds a specified quantity", () => {
  assert.deepEqual(new Basket().add("Baked Beans", 4).items, { "Baked Beans": 4 });
});
test("Basket increments an existing product", () => {
  const basket = new Basket().add("Baked Beans", 2).add("Baked Beans", 3);
  assert.deepEqual(basket.items, { "Baked Beans": 5 });
});
test("Basket stores multiple products", () => {
  const basket = new Basket().add("Baked Beans", 2).add("Biscuits", 1);
  assert.deepEqual(basket.items, { "Baked Beans": 2, Biscuits: 1 });
});
for (const invalid of [0, -1, 1.5]) {
  test(`Basket rejects invalid quantity ${invalid}`, () => {
    assert.throws(() => new Basket().add("Beans", invalid), /positive integer/);
  });
}
test("Basket query helpers work", () => {
  const basket = new Basket();
  assert.equal(basket.isEmpty, true);
  assert.equal(basket.length, 0);
  basket.add("Beans", 3).add("Biscuits", 2);
  assert.equal(basket.isEmpty, false);
  assert.equal(basket.length, 5);
  assert.equal(basket.has("Beans"), true);
  assert.equal(basket.has("Nope"), false);
});
test("Basket items returns a copy", () => {
  const basket = new Basket().add("Beans", 2);
  const copy = basket.items;
  copy.Hack = 99;
  assert.equal(basket.has("Hack"), false);
});

// Catalogue tests
test("Catalogue adds, updates, and retrieves products", () => {
  const catalogue = new Catalogue().addProduct("Baked Beans", "0.99").addProduct("Biscuits", "1.20");
  assert.equal(catalogue.size, 2);
  assert.equal(catalogue.getPrice("Baked Beans"), 0.99);
  catalogue.addProduct("Baked Beans", "1.10");
  assert.equal(catalogue.getPrice("Baked Beans"), 1.1);
});
test("Catalogue permits zero price", () => {
  assert.equal(new Catalogue().addProduct("Free Sample", "0").getPrice("Free Sample"), 0);
});
test("Catalogue rejects negative and malformed prices", () => {
  assert.throws(() => new Catalogue().addProduct("Bad", -1), /non-negative/);
  assert.throws(() => new Catalogue().addProduct("Bad", "1.999"), /at most 2 decimal places/);
});
test("Catalogue missing product throws", () => {
  assert.throws(() => new Catalogue().getPrice("Ghost Product"), /not in the catalogue/);
});
test("Catalogue query helpers and copy work", () => {
  const catalogue = new Catalogue().addProduct("Beans", "0.99");
  assert.equal(catalogue.hasProduct("Beans"), true);
  assert.equal(catalogue.hasProduct("Nope"), false);
  const copy = catalogue.products;
  copy.Hack = 0;
  assert.equal(catalogue.hasProduct("Hack"), false);
});

// Offer validation and calculations
test("Percentage offer calculates 25 percent", () => {
  const cat = new Catalogue().addProduct("Sardines", "1.89");
  const offer = new PercentageDiscountOffer("Sardines", 25);
  assert.equal(offer.calculateDiscountPence({ Sardines: 2 }, cat), 95);
});
test("Percentage offer validates percentage", () => {
  assert.throws(() => new PercentageDiscountOffer("Sardines", -1), /between 0 and 100/);
  assert.throws(() => new PercentageDiscountOffer("Sardines", 101), /between 0 and 100/);
});
test("Buy 2 get 1 free repeats for complete groups", () => {
  const cat = new Catalogue().addProduct("Baked Beans", "0.99");
  const offer = new BuyNGetMFreeOffer("Baked Beans", { buy: 2, free: 1 });
  assert.equal(offer.calculateDiscountPence({ "Baked Beans": 2 }, cat), 0);
  assert.equal(offer.calculateDiscountPence({ "Baked Beans": 3 }, cat), 99);
  assert.equal(offer.calculateDiscountPence({ "Baked Beans": 7 }, cat), 198);
});
test("Buy N get M free validates configuration", () => {
  assert.throws(() => new BuyNGetMFreeOffer("Beans", { buy: 0, free: 1 }), /must be ≥ 1/);
  assert.throws(() => new BuyNGetMFreeOffer("Beans", { buy: 2, free: 0 }), /must be ≥ 1/);
});
test("Shampoo offer maximises discount by descending grouping", () => {
  const offer = new BuyNGetCheapestFreeOffer(
    ["Shampoo (Large)", "Shampoo (Medium)", "Shampoo (Small)"],
    { groupSize: 3, freeCount: 1 }
  );
  const items = { "Shampoo (Large)": 3, "Shampoo (Medium)": 1, "Shampoo (Small)": 2 };
  assert.equal(offer.calculateDiscountPence(items, createCatalogue()), 600);
});
test("Shampoo offer ignores incomplete groups", () => {
  const offer = new BuyNGetCheapestFreeOffer(["L", "S"], { groupSize: 3, freeCount: 1 });
  const cat = new Catalogue().addProduct("L", "3.50").addProduct("S", "2.00");
  assert.equal(offer.calculateDiscountPence({ L: 1, S: 1 }, cat), 0);
  assert.equal(offer.calculateDiscountPence({ L: 2, S: 2 }, cat), 200);
});
test("Shampoo offer supports multiple free items", () => {
  const offer = new BuyNGetCheapestFreeOffer(["A", "B"], { groupSize: 4, freeCount: 2 });
  const cat = new Catalogue().addProduct("A", "4.00").addProduct("B", "1.00");
  assert.equal(offer.calculateDiscountPence({ A: 2, B: 2 }, cat), 200);
});
test("Shampoo offer validates configuration", () => {
  assert.throws(() => new BuyNGetCheapestFreeOffer(["A"], { groupSize: 1, freeCount: 1 }), /groupSize/);
  assert.throws(() => new BuyNGetCheapestFreeOffer(["A"], { groupSize: 3, freeCount: 0 }), /freeCount/);
  assert.throws(() => new BuyNGetCheapestFreeOffer(["A"], { groupSize: 3, freeCount: 3 }), /less than/);
});

// Acceptance and edge cases
test("Acceptance basket 1", () => {
  const basket = new Basket().add("Baked Beans", 4).add("Biscuits", 1);
  assert.deepEqual(pricer.price(basket, createCatalogue(), createOffers()), { subTotal: 5.16, discount: 0.99, total: 4.17 });
});
test("Acceptance basket 2", () => {
  const basket = new Basket().add("Baked Beans", 2).add("Biscuits", 1).add("Sardines", 2);
  assert.deepEqual(pricer.price(basket, createCatalogue(), createOffers()), { subTotal: 6.96, discount: 0.95, total: 6.01 });
});
test("Acceptance shampoo basket", () => {
  const basket = new Basket().add("Shampoo (Large)", 3).add("Shampoo (Medium)", 1).add("Shampoo (Small)", 2);
  assert.deepEqual(pricer.price(basket, createCatalogue(), createOffers()), { subTotal: 18.5, discount: 6, total: 12.5 });
});
test("Empty basket returns zeroes", () => {
  assert.deepEqual(pricer.price(new Basket(), createCatalogue(), createOffers()), { subTotal: 0, discount: 0, total: 0 });
});
test("No offers returns subtotal as total", () => {
  const basket = new Basket().add("Biscuits", 3);
  assert.deepEqual(pricer.price(basket, createCatalogue(), []), { subTotal: 3.6, discount: 0, total: 3.6 });
});
test("Null offers are accepted", () => {
  assert.equal(pricer.price(new Basket().add("Biscuits"), createCatalogue(), null).total, 1.2);
});
test("Stale offers and unmatched offers contribute zero", () => {
  const cat = new Catalogue().addProduct("Biscuits", "1.20");
  const basket = new Basket().add("Biscuits", 2);
  assert.deepEqual(pricer.price(basket, cat, [new PercentageDiscountOffer("Sardines", 25)]), { subTotal: 2.4, discount: 0, total: 2.4 });
});
test("Unknown basket product raises", () => {
  assert.throws(() => pricer.price(new Basket().add("Mystery Product"), createCatalogue(), []), /not in the catalogue/);
});
test("Multiple offers on same product are added", () => {
  const cat = new Catalogue().addProduct("Sardines", "1.89");
  const offers = [new PercentageDiscountOffer("Sardines", 25), new PercentageDiscountOffer("Sardines", 10)];
  assert.deepEqual(pricer.price(new Basket().add("Sardines"), cat, offers), { subTotal: 1.89, discount: 0.66, total: 1.23 });
});
test("Discount is clamped to subtotal", () => {
  const cat = new Catalogue().addProduct("Cheap Item", "0.10");
  const offers = [new PercentageDiscountOffer("Cheap Item", 100), new PercentageDiscountOffer("Cheap Item", 100)];
  assert.deepEqual(pricer.price(new Basket().add("Cheap Item"), cat, offers), { subTotal: 0.1, discount: 0.1, total: 0 });
});
test("Large quantities", () => {
  const offers = [new BuyNGetMFreeOffer("Baked Beans", { buy: 2, free: 1 })];
  assert.deepEqual(pricer.price(new Basket().add("Baked Beans", 100), createCatalogue(), offers), { subTotal: 99, discount: 32.67, total: 66.33 });
});