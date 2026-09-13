# OhMyFood

This repository preserves the original OpenClassrooms submission and develops an independent V2 on the ohmyfood-v2 branch.

- V1: main, archive/v1-openclassrooms, and the v1.0.0-openclassrooms tag.
- V2: React, TypeScript, and Vite. Discover and one data-driven Restaurant Detail route are implemented. Reservation remains a placeholder.

## Work locally on V2

Install Node.js 22.12 or newer, then run:

    npm install
    npm run dev

Check the project with:

    npm run typecheck
    npm test
    npm run build

The V2 app uses React Router's hash routes so it can later be hosted separately on GitHub Pages. Discover filters live within the hash URL, for example `#/?q=note`. Older links using a query before the hash are migrated automatically.

The four menus in `src/restaurant/menus.ts` adapt dishes and prices from the preserved V1 HTML pages. The duplicated Poulet rôti starter on La note enchantée was omitted; minor spelling and punctuation were normalized. Menu prices, restaurant descriptions, service notes, price indications, and dietary information are illustrative portfolio data, not live availability claims. Menu selection is local to the current visit and supports one restaurant at a time.

The V2 build uses a relative asset base for a future separate deployment. Legacy files in the root and public directory remain in the branch for now, but Vite excludes the public directory and builds only the new entry point. Do not publish V2 over the submitted V1 Pages site.

See docs/v1-baseline.md for the original implementation and docs/v2-design-foundation.md for the initial visual direction.
