 import { beforeEach, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";

const catalogue = {
  "Baked Beans": 0.99,
  Biscuits: 1.2,
  Sardines: 1.89,
  "Shampoo (Small)": 2,
  "Shampoo (Medium)": 2.5,
  "Shampoo (Large)": 3.5
};

const offers = [
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
    products: [
      "Shampoo (Small)",
      "Shampoo (Medium)",
      "Shampoo (Large)"
    ],
    groupSize: 3,
    freeCount: 1
  }
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => catalogue
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => offers
      })
  );
});

test("renders catalogue and all active offers", async () => {
  render(<App />);

  expect(
    await screen.findByText("Shampoo (Large)")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Buy any 3 shampoos, cheapest 1 free")
  ).toBeInTheDocument();
});