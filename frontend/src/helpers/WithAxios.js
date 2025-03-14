import { useMemo } from "react";
// import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import axiosInstance from "../api/axios.config";

const WithAxios = ({ children }) => {
  const { setIsLoggedIn, setUserData, setAuthData, isLoggedIn } = useUser();

  

  useMemo(() => {
    if (isLoggedIn) {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (error.response.status === 401 && originalRequest.url === "/auth/refresh-token") {
            return new Promise((_resolve, reject) => {
              setIsLoggedIn(false);
              setAuthData(null);
              setUserData(null);
              history.push("/login");
              reject(error);
            });
          }

          if (error.response.status === 401 && !originalRequest._retry) {
            try {
              originalRequest._retry = true;
              const res = await axiosInstance.post("/auth/refresh-token");
              sessionStorage.setItem("token", JSON.stringify(res.data.token));
              return axios(originalRequest);
            } catch (error) {
              sessionStorage.removeItem("token");
              setIsLoggedIn(false);
              setAuthData(null);
              setUserData(null);
              history.push("/login");
            }
          }
          return Promise.reject(error);
        }
      );
    }
  }, [isLoggedIn, setAuthData, setIsLoggedIn, setUserData]);

  return children;
};

export default WithAxios;
