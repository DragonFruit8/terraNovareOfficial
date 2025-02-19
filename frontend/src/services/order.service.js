import axiosInstance from "../api/axios.config";

class OrderService {
  createOrder(amount, itemTotal, ref, paymentMethod) {
    return axiosInstance.post("/orders/create", {
      amount,
      itemTotal,
      ref,
      paymentMethod,
    });
  }
  getAllOrders(page) {
    return axiosInstance.get(`/orders/?page=${page}`);
  }
  getOrder(id) {
    return axiosInstance.get(`/orders/${id}`);
  }
}

const orderService = new OrderService();
export default orderService;
