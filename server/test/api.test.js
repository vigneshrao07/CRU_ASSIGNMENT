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
    discount: 1.98,
    total: 3.18,
  });
});