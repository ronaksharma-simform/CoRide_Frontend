# CoRide Frontend

Ride-sharing web app frontend: users register and log in, create rides and vehicles, and request rides.

## Stack

React 19, TypeScript, Vite, Tailwind 4, shadcn/Radix UI, Redux Toolkit, React Router 7, React Hook Form, Axios, Leaflet maps.

## Layout

`src/features` (slices), `src/pages`, `src/layouts`, `src/routes`, `src/components`, `src/services` (API), `src/store`, `src/hooks`, `src/lib`, `src/types`.

## Checks

`npm run lint` and `npm run build` (runs `tsc -b`). No test runner yet. Husky + commitlint enforce conventional commits.

## Branches

Work branches cut from `develop`; PRs merge into `develop`. `main` is the release branch.
