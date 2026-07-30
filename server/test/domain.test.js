 test("Basket items returns a copy", () => {
  const basket = new Basket().add("Beans", 2);
  const copy = basket.items;

  copy.Hack = 99;

  assert.equal(basket.has("Hack"), false);
});

test("Catalogue query helpers and copy work", () => {
  const catalogue = new Catalogue()
    .addProduct("Beans", "0.99");

  assert.equal(catalogue.hasProduct("Beans"), true);
  assert.equal(catalogue.hasProduct("Nope"), false);

  const copy = catalogue.products;
  copy.Hack = 0;

  assert.equal(catalogue.hasProduct("Hack"), false);
});

// Offer validation and calculations
test("Percentage offer calculates 25 percent", () => {
  const cat = new Catalogue()
    .addProduct("Sardines", "1.89");

  const offer = new PercentageDiscountOffer("Sardines", 25);

  assert.equal(
    offer.calculateDiscountPence({ Sardines: 2 }, cat),
    94
  );
});

test("Percentage offer validates percentage", () => {
  assert.throws(
    () => new PercentageDiscountOffer("Sardines", -1),
    /between 0 and 100/
  );

  assert.throws(
    () => new PercentageDiscountOffer("Sardines", 101),
    /between 0 and 100/
  );
});

test("Buy 2 get 1 free repeats for complete groups", () => {
  const cat = new Catalogue()
    .addProduct("Baked Beans", "0.99");

  const offer = new BuyNGetMFreeOffer(
    "Baked Beans",
    { buy: 2, free: 1 }
  );

  assert.equal(
    offer.calculateDiscountPence({ "Baked Beans": 2 }, cat),
    0
  );

  assert.equal(
    offer.calculateDiscountPence({ "Baked Beans": 3 }, cat),
    99
  );

  assert.equal(
    offer.calculateDiscountPence({ "Baked Beans": 7 }, cat),
    198
  );
});

test("Buy N get M free validates configuration", () => {
  assert.throws(
    () => new BuyNGetMFreeOffer(
      "Beans",
      { buy: 0, free: 1 }
    ),
    /must be ≥ 1/
  );

  assert.throws(
    () => new BuyNGetMFreeOffer(
      "Beans",
      { buy: 2, free: 0 }
    ),
    /must be ≥ 1/
  );
});

test("Shampoo offer ignores incomplete groups", () => {
  const offer = new BuyNGetCheapestFreeOffer(
    ["L", "S"],
    { groupSize: 3, freeCount: 1 }
  );

  const cat = new Catalogue()
    .addProduct("L", "3.50")
    .addProduct("S", "2.00");

  assert.equal(
    offer.calculateDiscountPence({ L: 1, S: 1 }, cat),
    0
  );

  assert.equal(
    offer.calculateDiscountPence({ L: 2, S: 2 }, cat),
    200
  );
});