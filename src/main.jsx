import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
