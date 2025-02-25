import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const AdminDashboard = () => {
  const { userData, loading } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  /** ✅ Add Admin Role */
  const handleMakeAdmin = async (userId) => {
    try {
      await axiosInstance.put(
        `/users/make-admin/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`User ID ${userId} is now an admin.`);
      fetchUsers(); // Refresh users
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  /** ✅ Remove Admin Role */
  const handleRemoveAdmin = async (userId) => {
    try {
      await axiosInstance.put(
        `/users/remove-admin/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success(`User ID ${userId} is no longer an admin.`);
      fetchUsers();
    } catch (error) {
      console.error("❌ Error removing admin role:", error);
      toast.error("Failed to remove admin role.");
    }
  };

  /** ✅ Fetch Products */
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  }, []);

  /** ✅ Fetch Users */
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  }, []);

  /** ✅ Fetch Admin Profile */
  const fetchAdminProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdminProfile(response.data);
    } catch (error) {
      console.error("❌ Error fetching admin profile:", error);
      toast.error("Failed to fetch profile.");
    }
  }, []);

  /** ✅ Fetch Product Requests */
  const fetchProductRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/products/requests/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      toast.error("Failed to fetch product requests.");
    }
  }, []);

  useEffect(() => {
    if (!userData?.roles?.includes("admin")) {
      toast.error("Unauthorized Access! Redirecting...");
      navigate("/");
    } else {
      fetchUsers();
      fetchProducts();
      fetchProductRequests(); // ✅ Ensures product requests are fetched
    }
  }, [
    userData,
    loading,
    fetchUsers,
    fetchProducts,
    fetchProductRequests,
    navigate,
  ]);

  /** ✅ Handle Updating Product Request Status */
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await axiosInstance.put(
        `/products/requests/update/${requestId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("✅ Request status updated successfully!");
      fetchProductRequests();
    } catch (error) {
      console.error("❌ Error updating request:", error);
      toast.error(
        error.response?.data?.error || "Failed to update request status."
      );
    }
  };

  /** ✅ Handle Deleting a Product Request */
  const handleDeleteRequest = async (requestId) => {
    try {
      await axiosInstance.delete(`/products/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ Product request deleted.");
      setRequests(requests.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("❌ Error deleting request:", error);
      toast.error("Failed to delete product request.");
    }
  };

  /** ✅ Handle Deleting All Product Requests */
  const handleDeleteAllRequests = async () => {
    try {
      await axiosInstance.delete("/products/requests/delete-all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ All product requests deleted.");
      setRequests([]);
    } catch (error) {
      console.error("❌ Error deleting all requests:", error);
      toast.error("Failed to delete all product requests.");
    }
  };

  useEffect(() => {
    if (!userData?.roles?.includes("admin")) {
      toast.error("Unauthorized Access! Redirecting...");
      navigate("/");
    } else {
      fetchUsers();
      fetchProducts();
      fetchAdminProfile();
    }
  }, [
    userData,
    loading,
    fetchUsers,
    fetchProducts,
    fetchAdminProfile,
    navigate,
  ]);
  /** ✅ Handle Editing Admin Profile */
  const handleEditAdmin = () => {
    setEditingAdmin(true);
  };
/** ✅ Handle Saving Edited Product */
const handleSaveProduct = async () => {
    if (!editingProduct) return;

    // ✅ Basic Validation
    if (!editingProduct.name.trim() || !editingProduct.price || !editingProduct.stock) {
        toast.error("Product name, price, and stock are required!");
        return;
    }

    try {
        await axiosInstance.put(`/admin/products/${editingProduct.product_id}`, editingProduct, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        toast.success("✅ Product updated successfully!");
        fetchProducts();
        setEditingProduct(null);
    } catch (error) {
        console.error("❌ Error updating product:", error);
        toast.error("Failed to update product.");
    }
};

  /** ✅ Handle Editing Products */
  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleInputChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleSaveAdminProfile = async () => {
    try {
      await axiosInstance.put("/user/update", adminProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Profile updated successfully!");
      fetchAdminProfile();
      setEditingAdmin(false);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleAdminInputChange = (e) => {
    setAdminProfile({ ...adminProfile, [e.target.name]: e.target.value });
  };

  /** ✅ Handle Updating Product Request Quantity */
  const handleUpdateRequestQuantity = async (requestId, newQuantity) => {
    try {
      await axiosInstance.put(
        `/products/requests/update-quantity/${requestId}`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("✅ Request quantity updated successfully!");
      fetchProductRequests();
    } catch (error) {
      console.error("❌ Error updating request quantity:", error);
      toast.error(error.response?.data?.error || "Failed to update quantity.");
    }
  };

  /** ✅ Handle Deleting a Product */
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("✅ Product deleted successfully!");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>

      {/* ✅ Admin Profile Section */}
      <h3>Admin Profile</h3>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{adminProfile.fullname}</h5>
          <p className="card-text">
            <strong>Username:</strong> {adminProfile.username}
          </p>
          <p className="card-text">
            <strong>Email:</strong> {adminProfile.email}
          </p>
          <p className="card-text">
            <strong>Address:</strong> {adminProfile.address || "Not Provided"}
          </p>
          <p className="card-text">
            <strong>City:</strong> {adminProfile.city || "Not Provided"}
          </p>
          <p className="card-text">
            <strong>State:</strong> {adminProfile.state || "Not Provided"}
          </p>
          <p className="card-text">
            <strong>Country:</strong> {adminProfile.country || "Not Provided"}
          </p>
          <button className="btn btn-primary" onClick={handleEditAdmin}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* ✅ Edit Admin Profile Modal */}
      {editingAdmin && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingAdmin(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* ✅ Disabled Username */}
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={adminProfile.username}
                  className="form-control"
                  disabled
                />

                {/* ✅ Disabled Email */}
                <label className="form-label mt-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={adminProfile.email}
                  className="form-control"
                  disabled
                />

                {/* ✅ Editable Full Name */}
                <label className="form-label mt-2">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={adminProfile.fullname}
                  onChange={handleAdminInputChange}
                  className="form-control"
                  required
                />

                {/* ✅ Editable Address */}
                <label className="form-label mt-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={adminProfile.address || ""}
                  onChange={handleAdminInputChange}
                  className="form-control"
                />

                {/* ✅ Editable City */}
                <label className="form-label mt-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={adminProfile.city || ""}
                  onChange={handleAdminInputChange}
                  className="form-control"
                />

                {/* ✅ Editable State */}
                <label className="form-label mt-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={adminProfile.state || ""}
                  onChange={handleAdminInputChange}
                  className="form-control"
                />

                {/* ✅ Editable Country */}
                <label className="form-label mt-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={adminProfile.country || ""}
                  onChange={handleAdminInputChange}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingAdmin(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveAdminProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Manage Users */}
      <h3>Manage Users</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                {user.roles.includes("admin") ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveAdmin(user.id)}
                  >
                    Remove Admin
                  </button>
                ) : (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleMakeAdmin(user.id)}
                  >
                    Make Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Products Table with Delete Button */}
      <h3>Products</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {/* ✅ Edit Button */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    ✏️ Edit
                  </button>

                  {/* ✅ Delete Button */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Edit Product Modal */}
{/* ✅ Edit Product Modal */}
{editingProduct && (
    <div className="modal show d-block">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Edit Product</h5>
                    <button className="btn-close" onClick={() => setEditingProduct(null)}></button>
                </div>
                <div className="modal-body">
                    {/* ✅ Name */}
                    <label className="form-label">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={editingProduct.name || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                        required 
                    />

                    {/* ✅ Price */}
                    <label className="form-label mt-2">Price ($)</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={editingProduct.price || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                        min="0" 
                        step="0.01" 
                        required 
                    />

                    {/* ✅ Stock */}
                    <label className="form-label mt-2">Stock</label>
                    <input 
                        type="number" 
                        name="stock" 
                        value={editingProduct.stock || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                        min="0" 
                        required 
                    />

                    {/* ✅ Description */}
                    <label className="form-label mt-2">Description</label>
                    <textarea 
                        name="description" 
                        value={editingProduct.description || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                        rows="3" 
                        required 
                    ></textarea>

                    {/* ✅ Stripe Product ID */}
                    <label className="form-label mt-2">Stripe Product ID</label>
                    <input 
                        type="text" 
                        name="stripe_product_id" 
                        value={editingProduct.stripe_product_id || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                    />

                    {/* ✅ Stripe Price ID */}
                    <label className="form-label mt-2">Stripe Price ID</label>
                    <input 
                        type="text" 
                        name="stripe_price_id" 
                        value={editingProduct.stripe_price_id || ""}
                        onChange={handleInputChange} 
                        className="form-control" 
                    />

                    {/* ✅ Is Presale */}
                    <label className="form-label mt-2">Is Presale?</label>
                    <select 
                        name="is_presale" 
                        value={editingProduct.is_presale} 
                        onChange={handleInputChange} 
                        className="form-select" 
                        required
                    >
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>

                    {/* ✅ Release Date */}
                    <label className="form-label mt-2">Release Date</label>
                    <input 
                        type="date" 
                        name="release_date" 
                        value={editingProduct.release_date ? new Date(editingProduct.release_date).toISOString().split("T")[0] : ""} 
                        onChange={handleInputChange} 
                        className="form-control" 
                    />
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSaveProduct}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
)}


      {/* ✅ Product Requests Management */}
      <h3>Product Requests</h3>
      <button onClick={handleDeleteAllRequests} className="btn btn-danger mb-3">
        ❌ Delete All Requests
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Email</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Requested At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.user_email}</td>
                <td>{request.product}</td>

                {/* ✅ Editable Quantity Field */}
                <td>
                  <input
                    type="number"
                    value={request.quantity || 1}
                    min="1"
                    className="form-control"
                    onChange={(e) =>
                      handleUpdateRequestQuantity(request.id, e.target.value)
                    }
                  />
                </td>

                {/* ✅ Status Dropdown */}
                <td>
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleUpdateRequestStatus(request.id, e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>

                <td>{new Date(request.requested_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRequest(request.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
