const API_BASE = "http://localhost:3000/api";

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Request failed");
  }

  return body;
}

export const getCatalogue = () => request("/catalogue");

export const getOffers = () => request("/offers");

export const priceBasket = (basket) =>
  request("/price-basket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ basket })
  });