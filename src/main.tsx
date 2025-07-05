import React from "react";
import ReactDOM from "react-dom/client";

/* default Vite sheet */      import "./index.css";
/* global dark theme */       import "./Global.css";   // <── NEW

import GlyphRepository from "./components/GlyphRepository";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlyphRepository/>
  </React.StrictMode>
);
