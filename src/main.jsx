import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Some browsers/previews percent-encode hash slashes (#%2Fwall%2Fadmin).
// Normalize so HashRouter can match nested routes like /wall/admin.
try {
  const raw = window.location.hash.slice(1);
  if (raw && /%2f/i.test(raw)) {
    const decoded = decodeURIComponent(raw);
    if (decoded !== raw && decoded.startsWith("/")) {
      const next = `${window.location.pathname}${window.location.search}#${decoded}`;
      window.history.replaceState(null, "", next);
    }
  }
} catch {
  /* ignore */
}

if (import.meta.env.DEV) {
  console.info("[mannat-portfolio] dev UI bundle loaded (About v2 / dark hero).");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);