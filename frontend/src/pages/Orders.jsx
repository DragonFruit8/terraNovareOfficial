import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const Orders = () => {
  const { userData } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // console.log("📡 Fetching orders...");
        const response = await axiosInstance.get("/orders", {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });
        // console.log("📦 Orders Received:", response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setLoading(false);
      }
    };
  
    if (userData) fetchOrders();
  }, [userData]);
  

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.order_id} className="list-group-item">
              <h5>Order #{order.order_id}</h5>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total ? Number(order.total).toFixed(2) : "0.00"}</p>
              <p>Payment Method: {order.payment_method}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
              <Link to={`/orders/${order.order_id}`} className="btn btn-primary">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
