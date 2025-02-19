import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
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
import Login from "./pages/Login";
import Mission from "./pages/Mission";
import Nav from "./components/Nav";
import Next from "./pages/Next";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Sidebar from "./components/Sidebar";
// import Success from "./pages/Success"
// import ProductDetails from "./pages/ProductDetails";
// import Layout from "./layout/Layout";
import NotFound from "./pages/404";
import { useUser } from "./context/UserContext";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  const { userData } = useUser();

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <ThemeProvider>
        <Nav />
        <Sidebar />
        <Routes>
          <Route indexs path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/next" element={<Next />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* ✅ Only show Admin Dashboard if user is an admin */}
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

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
