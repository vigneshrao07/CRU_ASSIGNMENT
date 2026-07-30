import test from "node:test";
import assert from "node:assert/strict";
import {
  Basket,
  Catalogue
} from "../src/domain/index.js";

// Basket tests
test("Basket adds a single item", () => {
  const basket = new Basket().add("Baked Beans");
  assert.deepEqual(basket.items, { "Baked Beans": 1 });
});

test("Basket adds a specified quantity", () => {
  assert.deepEqual(
    new Basket().add("Baked Beans", 4).items,
    { "Baked Beans": 4 }
  );
});

test("Basket increments an existing product", () => {
  const basket = new Basket()
    .add("Baked Beans", 2)
    .add("Baked Beans", 3);

  assert.deepEqual(basket.items, { "Baked Beans": 5 });
});

test("Basket stores multiple products", () => {
  const basket = new Basket()
    .add("Baked Beans", 2)
    .add("Biscuits", 1);

  assert.deepEqual(basket.items, {
    "Baked Beans": 2,
    Biscuits: 1
  });
});

for (const invalid of [0, -1, 1.5]) {
  test(`Basket rejects invalid quantity ${invalid}`, () => {
    assert.throws(
      () => new Basket().add("Beans", invalid),
      /positive integer/
    );
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

// Catalogue tests
test("Catalogue adds, updates, and retrieves products", () => {
  const catalogue = new Catalogue()
    .addProduct("Baked Beans", "0.99")
    .addProduct("Biscuits", "1.20");

  assert.equal(catalogue.size, 2);
  assert.equal(catalogue.getPrice("Baked Beans"), 0.99);

  catalogue.addProduct("Baked Beans", "1.10");

  assert.equal(catalogue.getPrice("Baked Beans"), 1.1);
});

test("Catalogue permits zero price", () => {
  const catalogue = new Catalogue()
    .addProduct("Free Sample", "0");

  assert.equal(catalogue.getPrice("Free Sample"), 0);
});

test("Catalogue rejects negative and malformed prices", () => {
  assert.throws(
    () => new Catalogue().addProduct("Bad", -1),
    /non-negative/
  );

  assert.throws(
    () => new Catalogue().addProduct("Bad", "1.999"),
    /at most 2 decimal places/
  );
});

test("Catalogue missing product throws", () => {
  assert.throws(
    () => new Catalogue().getPrice("Ghost Product"),
    /not in the catalogue/
  );
});