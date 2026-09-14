# OhMyFood V2

OhMyFood V2 is an independent React and TypeScript rebuild of an earlier OpenClassrooms restaurant project, made after the training submission. Visitors can discover four Paris restaurants, explore their menus, compose a meal before arrival, choose a time slot, and complete a simulated reservation.

**Demo:** V2 is not published yet · [Preserved V1 demo](https://drgyz.github.io/OhMyFood/) · [V2 source](https://github.com/DRGYZ/OhMyFood/tree/ohmyfood-v2)

## The experience

Discover → search or filter → Restaurant → compose a menu → Reservation → availability → Confirmation.

Search ignores accents and case. Cuisine, neighborhood, and dietary filters live in the URL, so a filtered view can be shared or revisited. A menu belongs to one restaurant at a time and persists in `localStorage`; switching restaurants asks for confirmation before replacing it. Reservation availability is asynchronous and shows loading, empty, and error states. The form validates the date, time, and contact details, then keeps the confirmation in `sessionStorage` for the browser session.

## From V1 to V2

| Original OpenClassrooms version | Independent V2 rebuild |
| --- | --- |
| Static HTML pages with repeated restaurant markup | Data-driven React routes and shared typed restaurant/menu models |
| Decorative CSS dish interaction | Reducer-driven menu selection with validated persistence |
| No meaningful application state | URL filters, React state, and browser storage with distinct roles |
| Restaurant journey ended at the menu | Reservation availability, validation, and confirmation |
| Basic responsive styling and large assets | Mobile-first layouts, optimized imagery, and controlled loading |
| Limited keyboard support | Skip navigation, route focus, form errors, and live announcements |

The original submission and its Git history remain intact: `main` is the submitted V1, `archive/v1-openclassrooms` is its archival branch, and `v1.0.0-openclassrooms` marks that baseline. The rebuild lives on `ohmyfood-v2`.

## Technical choices

React and TypeScript provide typed restaurant, menu, reservation, and persistence contracts. State stays close to its owner: URL parameters hold Discover filters; Context and `useReducer` manage the active menu; Reservation uses local component state; `localStorage` keeps an unfinished menu; and `sessionStorage` keeps a completed confirmation. This scope does not need Redux or Zustand.

A small deterministic availability service uses native promises and cancellation rather than a backend. The interface uses native form controls, keyboard-operable selection and dialog flows, focus management, live status messages, and reduced-motion styles. Restaurant photography is compressed; the featured and hero images load eagerly, while listing images load lazily. Latin subsets of the variable fonts are self-hosted.

**Stack:** React, TypeScript, React Router, Vite, Vitest, CSS, and Fontsource variable fonts.

## Run locally

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

## Tests

The 30 focused tests cover restaurant lookups, search and filters, menu selection, storage validation, availability, reservation validation and date boundaries, and confirmation snapshots.

## Deployment

`npm run build` writes a static site to `dist/`. V2 uses hash routes and relative asset paths so it can be hosted separately from the preserved V1 GitHub Pages site. No V2 deployment has been made.

## Data and project notes

Restaurant and menu content is illustrative and descends from the original project. Availability is simulated: no real reservation is submitted, and no payment occurs.

The historical implementation is recorded in [the V1 baseline](docs/v1-baseline.md); [the V2 design foundation](docs/v2-design-foundation.md) records the initial visual direction.
