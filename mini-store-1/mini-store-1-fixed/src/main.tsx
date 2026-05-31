import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import AdminPanel from "./AdminPanel.tsx";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Открывай /admin через hash: localhost:3000/#admin
const isAdmin = window.location.hash === "#admin";

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {isAdmin ? <AdminPanel /> : <App />}
  </React.StrictMode>
);
