import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const AdminDashboard = () => {
  const { userData, loading } = useUser();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingAdminProfile, setEditingAdminProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [formData, setFormData] = useState({
    // username: "",
    fullname: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    price: "",
    description: "",
    image_url: "",
    is_presale: false,
    release_date: "",
    stripe_product_id: "",
    stripe_price_id: "",
    stock: "",
  });

  // ✅ Redirect non-admin users

// ✅ Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to fetch products!");
    }
  }, []);
  // ✅ Fetch Admin Profile
  const fetchAdminProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdminProfile(response.data);
    } catch (error) {
      console.error("❌ Error fetching admin profile:", error);
      toast.error("Failed to fetch profile!");
    }
  }, []);

  // ✅ Redirect if user is not an admin
  useEffect(() => {
    if (!userData?.roles?.includes("admin")) {
      toast.error("Unauthorized Access! Redirecting...");
      navigate("/");
    } else {
      fetchAdminProfile();
      fetchProducts();
    }
  }, [userData, loading, navigate, fetchProducts, fetchAdminProfile]);

  useEffect(() => {
    fetchProducts();
    fetchAdminProfile();
  }, [fetchProducts, fetchAdminProfile]);

  // ✅ Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      const response = await axiosInstance.put("/admin/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdminProfile(response.data); // ✅ Update context state
      toast.success("Profile updated successfully!");
      navigate("/admin");
      setEditingAdminProfile(null)
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };
  const handleAdminUpdate = () => {
    setEditingAdminProfile(true);
    fetchAdminProfile();
  };
  // ✅ Handle Input Changes
  const handleInputChange = (e, setState) => {
    const { name, value, type, checked } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // ✅ Update Product
  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      if (!editingProduct || !editingProduct.product_id) {
        toast.error("Product ID is missing!");
        return;
      }

      

      const { product_id, ...updatedData } = {
        ...editingProduct,
        slug: editingProduct.slug || "",
        is_presale: Boolean(editingProduct.is_presale),
        release_date: editingProduct.release_date ? new Date(editingProduct.release_date).toISOString() : null, // ✅ Ensure proper format
        stripe_product_id: editingProduct.stripe_product_id || "",
        stripe_price_id: editingProduct.stripe_price_id || ""
      };
  
      console.log("Updating product with ID:", editingProduct.product_id);

      await axiosInstance.put(`/admin/products/${product_id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Product updated successfully!");
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      toast.error("❌ Failed to update product!");
      console.error("❌ Error updating product:", error);
    }
  };

  // ✅ Create New Product (With Slug Generation)
  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      const newProductData = {
        ...newProduct,
        slug: newProduct.name.toLowerCase().replace(/\s+/g, "-"), // ✅ Auto-generate slug
      };

      await axiosInstance.post("/admin/product", newProductData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Product added successfully!");
      fetchProducts();
      setNewProduct({
        name: "",
        slug: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
        is_presale: false,
        release_date: "",
        stripe_product_id: "",
        stripe_price_id: "",
      });
    } catch (error) {
      toast.error("❌ Failed to add product!");
      console.error("❌ Error adding product:", error);
    }
  };
  // ✅ Delete Product
  const handleDeleteProduct = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized: Please log in again.");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmDelete) return;

      console.log("Deleting product with ID:", product_id);

      await axiosInstance.delete(`/admin/products/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Product deleted successfully!");
      setProducts((prev) =>
        prev.filter((product) => product.product_id !== product_id)
      );
    } catch (error) {
      toast.error("❌ Failed to delete product!");
      console.error("❌ Error deleting product:", error);
    }
  };

  // ✅ Handle Form Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="container col">
          {/* ✅ Admin Profile Section */}
          {editingAdminProfile && userData?.roles?.includes("admin") ? (
            <>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={adminProfile.username || userData?.username}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullname"
                    className="form-control"
                    value={formData?.fullname || userData?.fullname}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={adminProfile?.email || userData?.email}
                    onChange={handleChange}
                    disabled // ❗ Prevents email updates directly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    value={formData?.address || userData?.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    value={formData?.city || userData?.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    value={formData?.state || userData?.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={formData?.country || userData?.country}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </>
          ) : (
            <div className="container mt-5">
              <h2>Admin Profile</h2>
              <div className="card mb-2">
                <div className="card-body">
                  <h4 className="card-title">{adminProfile?.fullname || userData?.fullname}</h4>
                  <p className="card-text">
                    <strong>Username:</strong> {adminProfile?.username || userData?.username}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {adminProfile?.email || userData?.email}
                  </p>
                  <p className="card-text">
                    <strong>Address:</strong> {adminProfile?.address || userData?.address}
                  </p>
                  <p className="card-text">
                    <strong>City:</strong> {adminProfile?.city || userData?.city}
                  </p>
                  <p className="card-text">
                    <strong>State:</strong> {adminProfile?.state || userData?.state}
                  </p>
                  <p className="card-text">
                    <strong>Country:</strong> {adminProfile?.country || userData?.country}
                  </p>
                  <p className="card-text">
                    <strong>Role:</strong>{" "}
                    {adminProfile?.roles?.join(", ") || "User"}
                  </p>
                </div>
              </div>
              {/* username, fullname, address, city, state, country */}
              <button className="btn btn-secondary" onClick={handleAdminUpdate}>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {!loading && userData?.roles?.includes("admin") ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <div className="container my-5 col">
              <h2>Admin Profile</h2>
              <div className="container">
                <div className="mb-4">
                  <h4>Add New Product</h4>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => handleInputChange(e, setNewProduct)}
                    className="form-control mb-2"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => handleInputChange(e, setNewProduct)}
                    className="form-control mb-2"
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => handleInputChange(e, setNewProduct)}
                    className="form-control mb-2"
                  />
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => handleInputChange(e, setNewProduct)}
                    className="form-control mb-2"
                  />
                  {/* ✅ Fix: Ensure button properly calls handleCreateProduct */}
                  <button
                    className="btn btn-success"
                    onClick={handleCreateProduct}
                  >
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ✅ Products Table */}
        <div className="container my-5">
          <div className="table-responsive">
            <table className="table table-striped table-bordered w-100">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  {/* <th>Slug</th> */}
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th>Presale</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.name}</td>
                    {/* <td>{product.slug}</td> */}
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.description}</td>
                    <td>
                      <span className={`badge ${product.is_presale ? "bg-success" : "bg-secondary"}`}>
                        {product.is_presale ? "Presale" : "Regular"}
                      </span>
                    </td>

                    <td>{product.release_date ? new Date(product.release_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteProduct(product.product_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Edit Product Modal */}
        {editingProduct && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product - {editingProduct.name}</h5>
                  <button className="btn-close" onClick={() => setEditingProduct(null)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editingProduct.name || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        value={editingProduct.slug || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={editingProduct.price || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={editingProduct.stock || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Is Presale</label>
                      <select
                        name="is_presale"
                        value={editingProduct.is_presale || false}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                    <label className="form-label">release date</label>
                    <input
                      type="date"
                      name="release_date"
                      value={editingProduct.release_date ? new Date(editingProduct.release_date).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleInputChange(e, setEditingProduct)}
                      className="form-control"
                    />
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        value={editingProduct.description || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stripe Product ID</label>
                      <input
                        type="text"
                        name="stripe_product_id"
                        value={editingProduct.stripe_product_id || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Stripe Price ID</label>
                      <input
                        type="text"
                        name="stripe_price_id"
                        value={editingProduct.stripe_price_id || ''}
                        onChange={(e) => handleInputChange(e, setEditingProduct)}
                        className="form-control"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateProduct}>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
