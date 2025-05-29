

// index.tsx or main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom"; // ✅ import this

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap your App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
