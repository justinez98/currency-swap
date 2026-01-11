# Currency Swap Website

<img width="406" height="751" alt="Screenshot 2026-01-11 at 11 12 54 PM" src="https://github.com/user-attachments/assets/49fed6a5-f0fa-4206-ac2d-1a9edc7c74d5" />
<img width="881" height="572" alt="Screenshot 2026-01-11 at 10 39 38 PM" src="https://github.com/user-attachments/assets/16abedcb-2767-4ffe-8355-71d29a892eef" />

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

### Overview

The application follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Components, Pages, UI)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Business Logic Layer        │
│    (Store, Hooks, Utilities)        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│    (Constants, Types, Config)       │
└─────────────────────────────────────┘
```

### Architecture Decisions

| Decision                                  | Rationale                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| **Layered Architecture**                  | Clear separation of concerns enables maintainability and testability         |
| **Zustand State Management**              | Lightweight, performant eas                                                  |
| **URL Synchronization**                   | Enables shareable links, browser history support, and refresh persistence    |
| **Multi-Layer Race Condition Prevention** | Prevents incorrect calculations and UI flickering during rapid input         |
| **Reverse Calculation**                   | Provides flexible user experience allowing edits from either direction       |
| **Multi-Layer Validation**                | Ensures data integrity while maintaining smooth typing experience            |
| **Mobile-First Design**                   | Prioritizes the most constrained environment for better cross-device support |
| **Performance Optimizations**             | Memoization, debouncing, and cleanup ensure smooth user experience           |

### Key Technical Patterns

- **Debouncing**: 300ms delays for calculations and URL updates
- **Last Edited Tracking**: Prevents race conditions in bidirectional editing
- **Action-Based State Updates**: All state changes go through store actions
- **Component Memoization**: React.memo() and useMemo() prevent unnecessary re-renders
- **Error Boundaries**: Centralized error state with clear UI feedback
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Core Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Performance First**: Optimizations prevent unnecessary work
3. **User Experience**: Smooth interactions even during rapid input
4. **Maintainability**: Clear structure makes code easy to understand and modify
5. **Type Safety**: TypeScript ensures correctness at compile time
