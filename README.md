# OhMyFood

This repository preserves the original OpenClassrooms submission and develops an independent V2 on the ohmyfood-v2 branch.

- V1: main, archive/v1-openclassrooms, and the v1.0.0-openclassrooms tag.
- V2: React, TypeScript, and Vite. The current app intentionally renders no product screen; only the build and global design foundation are ready.

## Work locally on V2

Install Node.js 22.12 or newer, then run:

    npm install
    npm run dev

Check the foundation with:

    npm run build

The V2 build uses a relative asset base for a future separate deployment. Legacy files in the root and public directory remain in the branch for now, but Vite excludes the public directory and builds only the new entry point. Do not publish V2 over the submitted V1 Pages site.

See docs/v1-baseline.md for the original implementation and docs/v2-design-foundation.md for the initial visual direction.
