import React from "react";
import ReactDOM from "react-dom/client";

// Import required stylesheets
import "./index.css";
import "./Global.css";

// Import GlyphRepository component
import GlyphRepository from "./components/GlyphRepository";

// Define a constant for the root element
const appRoot = document.getElementById("root")!;

// Render the application with ReactDOM.createRoot()
const root = ReactDOM.createRoot(appRoot);

// Wrap the GlyphRepository component in a strict mode component if needed
root.render(
  <React.StrictMode>
    <GlyphRepository/>
  </React.StrictMode>
);

