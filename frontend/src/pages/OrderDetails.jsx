import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios.config";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(`/orders/${id}`);
        // console.log("📦 Order Details Fetched:", response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("❌ Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="container mt-5">
      <h2 aria-hidden="false" >Order Details</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
      <p><strong>Payment Method:</strong> {order.payment_method}</p>
      <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>

      <h3 aria-hidden="false" >Items</h3>
      {order.items.length > 0 ? (
        <ul className="list-group">
          {order.items.map((item) => (
            <li aria-hidden="false" key={item.product_id} className="list-group-item">
              <strong>{item.name}</strong> - ${Number(item.price).toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this order.</p>
      )}
    </div>
  );
};

export default OrderDetails;
