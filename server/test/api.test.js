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