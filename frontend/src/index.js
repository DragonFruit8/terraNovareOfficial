import { scan } from "react-scan";
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

const stripePromise = loadStripe("pk_test_51H9yaJCJsM5FOXWHqbppEf6qNGuuLHOWiDcX9n9JXW5a62Kq1uSWhuhCbIMkPVf7fc7g16Icq6FKVvchxqxCBzTu00Bl3o1w1K");

scan({
  enabled: true,
});
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