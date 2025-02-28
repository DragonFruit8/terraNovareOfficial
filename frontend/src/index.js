// import { scan } from "react-scan";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./context/UserContext"; // ✅ Import UserProvider
import { CartProvider } from "./context/CartContext"; // ✅ Import CartProvider
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ThemeProvider } from "./context/ThemeContext";

const stripePromise = loadStripe(
  `pk_live_51H9yaJCJsM5FOXWHe4MYqZdeoHiRQHmwDkmXuvs1qqprojx7p2kJq4QiDZOjTp7bhWjWi9VroFyPgQuSr9rwLOmT00fjHhiTva`
);

// scan({
//   enabled: true,
// });
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider>
  <Elements stripe={stripePromise}>
    <HelmetProvider>
      <ErrorBoundary>
        <UserProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </UserProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </Elements>
  </ThemeProvider>
);