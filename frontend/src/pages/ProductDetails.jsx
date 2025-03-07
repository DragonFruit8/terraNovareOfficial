import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosInstance from "../api/axios.config";
import moment from "moment"; // ✅ For formatting release dates

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!product) return <div className="text-center mt-5">Product not found.</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image_url} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2 aria-hidden="false" >{product.name}</h2>
          <p aria-hidden="false" className="text-muted">{product.description}</p>
          <h4 aria-hidden="false" >${product.price.toFixed(2)}</h4>

          {/* 🔹 Show Pre-Sale Message */}
          {product.is_presale && (
            <div className="alert alert-warning">
              Pre-sale available! Product releases on{" "}
              <strong>{moment(product.release_date).format("MMMM D, YYYY")}</strong>
            </div>
          )}

          <button className="btn btn-primary mt-3" onClick={() => addToCart(product)}>
            {product.is_presale ? "Pre-Order Now" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
