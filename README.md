 # Shopping Basket Pricer — Node.js, Express and React
 A full-stack Node.js shopping basket application developed , featuring reusable pricing logic, promotional offer handling, automated tests, an Express API, and a React-based user interface.


## Included offers

- Buy N, get M free: Baked Beans — buy 2 and get 1 free.
- Percentage discount: Sardines — 25% off.
- Grouped cheapest-free offer: buy any 3 eligible shampoos and get the cheapest one in each optimally arranged group free.

The shampoo algorithm expands eligible quantities into individual prices, sorts prices from highest to lowest, splits them into complete groups, and makes the cheapest item(s) in each group free. This maximises the customer's valid discount.

## Structure

```text
shopping-basket-node-express-react/
├── server/
│   ├── src/domain/       # Reusable pricing library
│   ├── src/config/       # Example catalogue and offers
│   ├── src/app.js        # Express application
│   ├── src/server.js     # API entry point
│   └── test/             # Domain and API tests
├── client/
│   ├── src/              # React application
│   └── test/             # React tests
└── package.json          # Workspace commands
```

## Install

Requires Node.js 20 or newer.

```bash
npm install
```

## Run

In two terminals:

```bash
npm run start:server
```

```bash
npm run start:client
```

Open the Vite URL printed in the second terminal, normally `http://localhost:5173`.

Alternatively, run both together:

```bash
npm run dev
```

## Test

```bash
npm test
```

Or separately:

```bash
npm run test:server
npm run test:client
```
## API

### `GET /api/catalogue`

Returns current products and prices.

### `GET /api/offers`

Returns the active offer configuration.

### `POST /api/price-basket`

Example request:

```json
{
  "basket": {
    "Shampoo (Large)": 3,
    "Shampoo (Medium)": 1,
    "Shampoo (Small)": 2
  }
}
```

Response:

```json
{
  "subTotal": 18.5,
  "discount": 5.6,
  "total": 12.5
}
```

## Money handling

Internally, catalogue prices and discounts are calculated as integer pence. This avoids JavaScript floating-point errors while still returning normal pound values through the API.
