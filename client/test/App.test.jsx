import { beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../src/App.jsx";

const catalogue = {
  "Baked Beans": 0.99, Biscuits: 1.2, Sardines: 1.89,
  "Shampoo (Small)": 2, "Shampoo (Medium)": 2.5, "Shampoo (Large)": 3.5
};
const offers = [
  { type: "BUY_N_GET_M_FREE", product: "Baked Beans", buy: 2, free: 1 },
  { type: "PERCENTAGE", product: "Sardines", percentage: 25 },
  { type: "BUY_N_GET_CHEAPEST_FREE", products: ["Shampoo (Small)", "Shampoo (Medium)", "Shampoo (Large)"], groupSize: 3, freeCount: 1 }
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => catalogue })
    .mockResolvedValueOnce({ ok: true, json: async () => offers }));
});

test("renders catalogue and all active offers", async () => {
  render(<App />);
  expect(await screen.findByText("Shampoo (Large)")).toBeInTheDocument();
  expect(screen.getByText("Buy any 3 shampoos, cheapest 1 free")).toBeInTheDocument();
});

test("submits shampoo basket and displays matching totals", async () => {
  fetch.mockReset();
  fetch
    .mockResolvedValueOnce({ ok: true, json: async () => catalogue })
    .mockResolvedValueOnce({ ok: true, json: async () => offers })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ subTotal: 17, discount: 5.5, total: 11.5 }) });
  render(<App />);
  await screen.findByText("Shampoo (Large)");
  fireEvent.change(screen.getByLabelText("Shampoo (Large) quantity"), { target: { value: "3" } });
  fireEvent.change(screen.getByLabelText("Shampoo (Medium) quantity"), { target: { value: "1" } });
  fireEvent.change(screen.getByLabelText("Shampoo (Small) quantity"), { target: { value: "2" } });
  fireEvent.click(screen.getByRole("button", { name: /calculate basket/i }));
  await waitFor(() => expect(screen.getByText("£11.50")).toBeInTheDocument());
  expect(screen.getByText("−£5.50")).toBeInTheDocument();
});