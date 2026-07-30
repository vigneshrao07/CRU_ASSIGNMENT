import express from "express";
import { createCatalogue } from "./config/shop.js";

export function createApp() {
  const app = express();
  const catalogue = createCatalogue();

  app.get("/api/catalogue", (_req, res) => {
    res.json(catalogue.products);
  });

  return app;
}