# Currency Swap Website

A currency conversion tool built with Next.js and React. Convert between 11 currencies with real-time calculations.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- TailwindCSS v4
- Zustand for state management

## Project Structure

```
assignment/
├── app/                    # Next.js pages
├── components/             # React components
├── store/                  # Zustand state store
├── hooks/                  # Custom hooks
├── utils/                  # Utility functions
└── docs/                   # Documentation
```

## Supported Currencies

All rates are based on USD (1 USD = rate):

- USD: 1.0
- HKD: 7.798926
- AUD: 1.487089
- MYR: 4.375
- GBP: 0.761538
- EUR: 0.899038
- IDR: 15538.905259
- NZD: 1.625053
- CNY: 7.1369
- CZK: 22.549
- AED: 3.672815

## How It Works

All conversions go through USD as the base currency:

1. Convert source currency to USD
2. Convert USD to target currency
3. Apply 1% platform fee (deducted from output)

Example: Converting 100 USD to EUR

- 100 USD × 0.899038 = 89.9038 EUR (before fee)
- 89.9038 EUR × 0.99 = 89.004762 EUR (after 1% fee)

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Key Features

### Bidirectional Editing

You can edit either the input or output amount. The app tracks which field you last edited and calculates the other one automatically. It handles rapid typing with debouncing to prevent calculation conflicts.

### URL State Sync

The swap state is saved in the URL, so you can:

- Share links like `?from=USD&to=EUR&amount=100`
- Refresh the page and keep your settings
- Use browser back/forward buttons

### Input Validation

The app validates all inputs:

- Only numbers and decimals allowed
- Minimum amount: 0.01
- Maximum amount: 999,999,999,999.99
- Maximum 8 decimal places
- Clear error messages when validation fails

## Architecture

### State Management

Using Zustand for global state and URL parameters for shareable links. This gives us:

- Fast state updates without provider overhead
- Shareable links that work on refresh
- Browser navigation support
