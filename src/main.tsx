import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "./context/Context.tsx";
import AuthObserver from "./context/AuthObserver.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider>
    <AuthObserver />
    <App />
  </Provider>
);
