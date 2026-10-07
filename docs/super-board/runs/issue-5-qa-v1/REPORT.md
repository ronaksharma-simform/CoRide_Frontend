# QA v1 - issue #5

- AC1 pass: `src/App.tsx:30` renders `<RouterProvider />` then `<Toaster />`; no `;` text node. Dev server at `/`: `#root` innerText is "Landing Page / Login / SignUp", zero direct text nodes (desktop.png).
- AC2 partial: `npm run lint` clean. `npm run build` fails at `tsc -b` with 38 errors on this branch and the same 38 on `develop` (src/App.tsx reverted); `vite build` alone succeeds.
- No test runner in the repo, so no test files added.
