import axiosInstance from "../api/axios.config";
// import { useUser } from "../context/UserContext";
// import localCart from "../helpers/sessionStorage";

class CartService {
  async getCart(user_id) {
    try {
      const token = sessionStorage.getItem("token"); // ✅ Get token from sessionStorage
      if (!token) {
        console.error("❌ No authentication token found");
        return { error: "User authentication required" };
      }

      return axiosInstance.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
        params: { user_id },
      });
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
      throw error;
    }
  }

  async addToCart(product_id, quantity) {
    try {
      const token = sessionStorage.getItem("token"); // ✅ Get token from sessionStorage
      if (!token) {
        console.error("❌ No authentication token found");
        return { error: "User is not authenticated" };
      }
  
      const response = await axiosInstance.post(
        "/cart/add",
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Send token with request
      );
  
      return response.data;
    } catch (error) {
      console.error("❌ Error adding to cart:", error.response?.data || error.message);
      throw error;
    }
  }

  async removeFromCart(product_id) {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("❌ No authentication token found");
        throw new Error("User authentication required");
      }

      return axiosInstance.delete("/cart/delete", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
        data: { product_id },
      });
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error.message);
      throw error;
    }
  }

  async increment(user_id, product_id) {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("No authentication token provided");

      return await axiosInstance.put(
        "/cart/increment",
        { user_id, product_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error incrementing quantity:", error.response?.data || error.message);
      throw error;
    }
  }

  async decrement(product_id) {
    try {
      if (!product_id) throw new Error("Product ID is required");

      const token = sessionStorage.getItem("token"); // Ensure token is sent
      const response = await axiosInstance.put("/cart/decrement", 
        { product_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error("Error decrementing quantity:", error.response?.data || error.message);
      throw error;
    }
}
}

const cartService = new CartService();
export default cartService;
