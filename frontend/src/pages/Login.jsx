import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner"
import ReCAPTCHA from "react-google-recaptcha";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";

const Login = () => {
  const recaptchaRef = useRef(null);
  const [serverError, setServerError] = useState("");
  const [ loading, setLoading ] = useState(false);
  const { setUserData } = useUser(); // ✅ Get `loginUser` from context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("📡 Sending login request...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // ✅ 10s timeout
  
    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
  
      const response = await axiosInstance.post(
        "/auth/login",
        { email, password, recaptchaToken: token },
        { signal: controller.signal } // ✅ Attach abort signal
      );
      
      clearTimeout(timeoutId); // ✅ Clear timeout if successful
  
      if (!response || !response.data) {
        throw new Error("No response from server.");
      }
  
      // ✅ Process user roles correctly
      const { token: authToken, user } = response.data;
      const roleRoutes = { admin: "/admin", user: "/profile", member: "/" };
      const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
      const highestRole = ["admin", "user", "member"].find((role) => userRoles.includes(role)) || "user";
  
      sessionStorage.setItem("token", authToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      setUserData(user);
  
      toast.success("Login successful!");
      navigate(roleRoutes[highestRole], { replace: true });
  
    } catch (error) {
      clearTimeout(timeoutId);
  
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error.name === "AbortError") {
        errorMessage = "⏳ Server timeout. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "🚫 Unauthorized. Check your credentials.";
      }
  
      console.error("❌ Login failed:", errorMessage);
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  

  

  return (
    <div className="container d-flex col align-items-center justify-content-center my-5">
      <div
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {serverError && (
              <div className="alert alert-danger mt-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {serverError}
              </div>
            )}
          </div>
          {/* Invisible reCAPTCHA */}
          <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              size="invisible"
              ref={recaptchaRef}
            />
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

        </form>
        <div className="d-flex text-center justify-content-center mt-2 gap-3">
          <p>
            <Link to="/register" className="text-primary">
              Register
            </Link>
            </p>
            <p>
            <Link to="/forgot" className="text-danger">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
