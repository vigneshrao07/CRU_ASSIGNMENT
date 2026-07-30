 import { useEffect, useMemo, useState } from "react";
import { getCatalogue, getOffers, priceBasket } from "./api.js";
import "./styles.css";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export default function App() {
  const [catalogue, setCatalogue] = useState({});
  const [offers, setOffers] = useState([]);
  const [basket, setBasket] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCatalogue(), getOffers()])
      .then(([catalogueData, offerData]) => {
        setCatalogue(catalogueData);
        setOffers(offerData);
        setBasket(Object.fromEntries(Object.keys(catalogueData).map((name) => [name, 0])));
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const basketCount = useMemo(() => Object.values(basket).reduce((sum, value) => sum + Number(value || 0), 0), [basket]);

  function changeQuantity(product, value) {
    const quantity = Math.max(0, Number.parseInt(value || "0", 10));
    setBasket((current) => ({ ...current, [product]: quantity }));
  }

  async function calculate(event) {
    event.preventDefault();
    setError("");
    try {
      setResult(await priceBasket(basket));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <h1>Shopping Basket Pricer</h1>
        <p>Select quantities and apply all active supermarket offers, including the maximum shampoo discount.</p>
      </section>

      {error && <p role="alert" className="error">{error}</p>}

      <section className="layout">
        <form className="panel" onSubmit={calculate}>
          <div className="panel-heading"><h2>Products</h2><span>{basketCount} items</span></div>
          <div className="products">
            {Object.entries(catalogue).map(([product, price]) => (
              <label className="product" key={product}>
                <span><strong>{product}</strong><small>{money.format(price)}</small></span>
                <input aria-label={`${product} quantity`} type="number" min="0" step="1" value={basket[product] ?? 0} onChange={(event) => changeQuantity(product, event.target.value)} />
              </label>
            ))}
          </div>
          <button type="submit">Calculate basket</button>
        </form>

        <aside className="stack">
          <section className="panel">
            <h2>Active offers</h2>
            <ul className="offers">
              {offers.map((offer, index) => <li key={index}>{describeOffer(offer)}</li>)}
            </ul>
          </section>
          <section className="panel result" aria-live="polite">
            <h2>Price summary</h2>
            <dl>
              <div><dt>Subtotal</dt><dd>{money.format(result?.subTotal ?? 0)}</dd></div>
              <div><dt>Discount</dt><dd>−{money.format(result?.discount ?? 0)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{money.format(result?.total ?? 0)}</dd></div>
            </dl>
          </section>
        </aside>
      </section>
    </main>
  );
}

function describeOffer(offer) {
  if (offer.type === "BUY_N_GET_M_FREE") return `Buy ${offer.buy} ${offer.product}, get ${offer.free} free`;
  if (offer.type === "PERCENTAGE") return `${offer.percentage}% off ${offer.product}`;
  if (offer.type === "BUY_N_GET_CHEAPEST_FREE") return `Buy any ${offer.groupSize} shampoos, cheapest ${offer.freeCount} free`;
  return offer.type;
}