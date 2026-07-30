 import express from "express";
import cors from "cors";
import { createCatalogue, createOffers } from "./config/shop.js";

export function createApp() {
  const app = express();
  const catalogue = createCatalogue();
  const offers = createOffers();

  app.use(cors());
  app.use(express.json());

  app.get("/api/catalogue", (_req, res) => {
    res.json(catalogue.products);
  });

  app.get("/api/offers", (_req, res) => {
    res.json([
      {
        type: "BUY_N_GET_M_FREE",
        product: "Baked Beans",
        buy: 2,
        free: 1
      },
      {
        type: "PERCENTAGE",
        product: "Sardines",
        percentage: 25
      },
      {
        type: "BUY_N_GET_CHEAPEST_FREE",
        products: ["Shampoo (Small)", "Shampoo (Medium)"],
        groupSize: 3,
        freeCount: 1
      }
    ]);
  });

  return app;
}