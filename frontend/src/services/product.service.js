import axiosInstance from "../api/axios.config";

class ProductService {
  getProducts(page) {
    return axiosInstance.get(`/products/?page=${page}`);
  }
  getProduct(id) {
    return axiosInstance.get(`/products/${id}`);
  }
  getProductByName(name) {
    return axiosInstance.get(`/products/${name}`);
  }
}

const productService = new ProductService();
export default productService;
