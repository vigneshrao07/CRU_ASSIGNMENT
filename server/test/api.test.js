 import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";

const app = createApp();

test("GET catalogue returns all products", async () => {
  const response = await request(app).get("/api/catalogue").expect(200);
  assert.equal(response.body["Shampoo (Large)"], 3.5);
});

test("GET offers includes shampoo offer", async () => {
  const response = await request(app).get("/api/offers").expect(200);
  assert.equal(response.body[2].type, "BUY_N_GET_CHEAPEST_FREE");
});

test("POST prices acceptance basket 1", async () => {
  const response = await request(app)
    .post("/api/price-basket")
    .send({ basket: { "Baked Beans": 4, Biscuits: 1 } })
    .expect(200);
  assert.deepEqual(response.body, {
    subTotal: 5.16,
    discount: 0.99,
    total: 4.17,
  });
});

test("POST prices acceptance basket 2", async () => {
  const response = await request(app)
    .post("/api/price-basket")
    .send({ basket: { "Baked Beans": 2, Biscuits: 1, Sardines: 2 } })
    .expect(200);
  assert.deepEqual(response.body, {
    subTotal: 6.96,
    discount: 0.95,
    total: 6.01,
  });
});

test("POST prices shampoo basket", async () => {
  const response = await request(app)
    .post("/api/price-basket")
    .send({
      basket: {
        "Shampoo (Large)": 3,
        "Shampoo (Medium)": 1,
        "Shampoo (Small)": 2,
      },
    })
    .expect(200);
  assert.deepEqual(response.body, { subTotal: 18.5, discount: 6, total: 12.5 });
});

test("POST validates invalid basket", async () => {
  const response = await request(app)
    .post("/api/price-basket")
    .send({ basket: { Biscuits: -1 } })
    .expect(400);
  assert.match(response.body.error, /positive integer/);
});