 import express from "express";
import cors from "cors";
import { Basket } from "./domain/Basket.js";
import { BasketPricer } from "./domain/BasketPricer.js";
import { createCatalogue, createOffers } from "./config/shop.js";

export function createApp() {
  const app = express();
  const catalogue = createCatalogue();
  const offers = createOffers();
  const pricer = new BasketPricer();
  app.use(cors());
  app.use(express.json());

  app.get("/api/catalogue", (_req, res) => res.json(catalogue.products));
  app.get("/api/offers", (_req, res) => res.json([
    { type: "BUY_N_GET_M_FREE", product: "Baked Beans", buy: 2, free: 1 },
    { type: "PERCENTAGE", product: "Sardines", percentage: 25 },
    { type: "BUY_N_GET_CHEAPEST_FREE", products: ["Shampoo (Small)", "Shampoo (Medium)", "Shampoo (Large)"], groupSize: 3, freeCount: 1 }
  ]));

  app.post("/api/price-basket", (req, res) => {
    try {
      const rawBasket = req.body?.basket;
      if (!rawBasket || typeof rawBasket !== "object" || Array.isArray(rawBasket)) throw new Error("basket must be an object");
      const basket = new Basket();
      for (const [product, quantity] of Object.entries(rawBasket)) {
        if (quantity === 0) continue;
        basket.add(product, quantity);
      }
      res.json(pricer.price(basket, catalogue, offers));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  return app;
}