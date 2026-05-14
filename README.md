# React + Vite

## Backend API (Typing PRO leaderboard + contact form)

The REST API lives in a **separate repo** next to this one, not inside this folder:

- `../mannat-portfolio-api` (sibling of `mannat-portfolio` on disk)

From **this** directory you can run:

- `npm run api:install` — install API dependencies once
- `npm run api:start` — start the API on port **3001** (requires `../mannat-portfolio-api/.env` with `MONGODB_URI`)

Or open a terminal in `mannat-portfolio-api` and run `npm install` then `npm start`.

Copy `mannat-portfolio-api/.env.example` → `.env` there and set your Atlas URI. For **local** portfolio dev, copy this repo’s `.env.example` → `.env` and set `VITE_API_BASE=http://localhost:3001` (no trailing slash).

### GitHub Pages + live API (Render)

The value of **`VITE_API_BASE` is baked in at build time**. After you deploy the API (see `mannat-portfolio-api/DEPLOY-RENDER.md`), rebuild and redeploy the site with your **HTTPS** Render URL (no trailing slash), for example:

```bash
VITE_API_BASE=https://YOUR-SERVICE.onrender.com npm run build
npm run deploy
```

Or put `VITE_API_BASE=...` in a **local** `.env.production` (optional; do not commit secrets—only the public API URL) and run `npm run build` then `npm run deploy`.

Then open [the live site](https://mmannat.github.io/mannat-portfolio/) → **Interactive Lab** and confirm the leaderboard loads.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
