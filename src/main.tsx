import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./Global.css";

import GlyphRepository from "./components/GlyphRepository";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlyphRepository/>
  </React.StrictMode>
);
