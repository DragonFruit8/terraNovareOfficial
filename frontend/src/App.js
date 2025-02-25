import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react"
import { ToastContainer } from "react-toastify";
import { useUser } from "./context/UserContext";
// import ProtectedRoute from "./protected/ProtectedRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import Cart from "./pages/Cart";
import Checkout from "./components/Checkout";
import CompleteProfile from "./pages/CompleteProfile";
import Brand from "./pages/Brand";
// import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Footer from "./components/Footer";
import HomePage from "./pages/Homepage";
import DarkLightToggle from "./components/DarkLightToggle";
// import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Mission from "./pages/Mission";
import Nav from "./components/Nav";
import Next from "./pages/Next";
import NotFound from "./pages/404";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import PrivacyNotice from "./components/PrivacyNotice";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import ReactGA from 'react-ga4';
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Sidebar from "./components/Sidebar";
// import Success from "./pages/Success"
import Terms from "./pages/Terms";
import TermConditions from "./pages/TermConditions";
// import UnderConstruction from "./components/UnderConstruction";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const TRACKING_ID = "G-2GV3JM9TGV";

const App = () => {
  const { userData } = useUser();

  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem("privacyConsent");

    if (consent === "accepted") {
      ReactGA.initialize(TRACKING_ID);
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }
  }, [location]);


  return (
    <>
      <HelmetProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <ThemeProvider>
          <Nav />
          <Sidebar />

          <div className="app-container">
            <div className="content">
              <Routes>
                <Route
                  path="/admin"
                  element={
                    userData?.roles?.includes("admin") ? (
                      <AdminDashboard />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  }
                />
                <Route index path="/" element={<HomePage />} />
                <Route path="/brand" element={<Brand />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/forgot" element={<ForgotPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/next" element={<Next />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/terms-and-conditions" element={<TermConditions />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <PrivacyNotice />
              <DarkLightToggle />
            </div>
            <Footer />

          </div>
        </ThemeProvider>
      </HelmetProvider>

    </>
  );
};

export default App;
