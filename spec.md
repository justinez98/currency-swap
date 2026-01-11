## Design a Currency Swap website

Suggested FE stack (you can use others that you're more comfortable with):

- React + NextJS
- TailwindCSS

## Tests:

Refer to https://jup.ag, and design a mocked currency swap website.
Use these hardcoded currency pairs (based on USD) as a reference:

```
HKD	7.798926
AUD	1.487089
MYR	4.375
GBP	0.761538
EUR	0.899038
IDR	15538.905259
NZD	1.625053
CNY	7.1369
CZK	22.549
AED	3.672815
```

- Design a currency swap website

  - With input and output boxes
  - With dropdowns to select the currency
  - With a button to swap the currency

- Design reference output amount

  - Assuming the site charges a 1% fees,
  - Based on the hardcoded currency pairs above, design an currency swap website that changes when:
    - User changes the input amount
    - User changes the input currency
    - User changes the output amount
    - User changes the output currency

- Pointers
  - how you design the architecture of the codebase and why?
  - how you deal with state management?
  - URL structuring, shareable link, and works on refresh
  - input and output amount should be in sync, ability to simulate and prevent race condition
  - support reverse calculation (user edit output amount, and input amount should be updated)
  - input validation, and error handling
  - mobile-first design
  - performance profiling
