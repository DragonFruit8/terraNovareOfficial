import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
    is_presale: false,
    release_date: "",
    stripe_product_id: "",
    stripe_price_id: "",
  });

  useEffect(() => {
    if (adminProfile) {
      setProfileData({
        fullname: adminProfile.fullname || "",
        email: adminProfile.email || "",
        address: adminProfile.address || "",
        city: adminProfile.city || "",
        state: adminProfile.state || "",
        country: adminProfile.country || "",
      });
    }
  }, [adminProfile]);

  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");

  const fetchAdminProfile = useCallback(async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      console.warn("🚫 No token found, redirecting...");
      navigate("/login");
      return;
    }

    // console.log("📡 Fetching admin profile with token:", token); // ✅ Log token before request

    try {
      const response = await axiosInstance.get("/user/me", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
      });

      // console.log("✅ Response received:", response.data); // ✅ Log response

      if (!response.data.roles.includes("admin")) {
        console.warn("🚫 User is not an admin, redirecting...");
        navigate("/");
        return;
      }

      setAdminProfile(response.data);
    } catch (error) {
      console.error(
        "❌ Error fetching admin profile:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        console.warn("🚫 Unauthorized! Clearing token and redirecting...");
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate, setAdminProfile]);

  /** ✅ Fetch Data Functions */
  const fetchUsers = useCallback(async () => {
    if (!token) {
      toast.error("⚠️ Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get("/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data);
    } catch (error) {
      console.error(
        "❌ Error fetching users:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to fetch users. Unauthorized!");
    }
  }, [token, navigate, setUsers]); // ✅ `setUsers` included as dependency

  useEffect(() => {
    if (!token) {
      console.warn("🚫 No token found, redirecting to login...");
      navigate("/login");
      return;
    }
    fetchAdminProfile();
  }, [token, fetchAdminProfile, navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // ✅ Fetch users when needed

  const fetchProducts = useCallback(async () => {
    if (!token) {
      toast.error("⚠️ Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get("/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast.error("Failed to fetch products. Unauthorized!");
    }
  }, [token, navigate]);

  const fetchProductRequests = useCallback(async () => {
    if (!token) {
      toast.error("⚠️ Unauthorized! Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get("/products/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests(response.data);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      toast.error("Failed to fetch requests. Unauthorized!");
    }
  }, [token, navigate]);

  /** ✅ UseEffect: Load Data */
  useEffect(() => {
    if (!loading && !userData) {
      toast.error("⚠️ Please log in to access this page.");
      navigate("/login");
    }
  }, [userData, loading, navigate]);

  useEffect(() => {
    if (!loading) {
      if (!userData?.roles?.includes("admin")) {
        toast.error("Unauthorized Access! Redirecting...");
        navigate("/login");
      } else {
        fetchUsers();
        fetchProducts();
        fetchProductRequests();
        fetchAdminProfile();
      }
    }
  }, [
    userData,
    fetchUsers,
    fetchProducts,
    fetchProductRequests,
    fetchAdminProfile,
    navigate,
    loading,
    token,
  ]);

  /** ✅ Handle User Role Changes */
  const handleMakeAdmin = async (id, email) => {
    if (!id || !email) return toast.error("Invalid user selection.");
    if (!window.confirm(`Make ${email} an admin?`)) return;

    try {
      await axiosInstance.put(`/admin/users/make-admin/${id}`);
      toast.success("User promoted to admin!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const handleRemoveAdmin = async (id, email) => {
    if (!id || !email) return toast.error("Invalid user selection.");
    if (!window.confirm(`Remove ${email} from admin?`)) return;

    try {
      await axiosInstance.put(`/admin/users/remove-admin/${id}`);
      toast.success("Admin role removed!");
      fetchUsers();
    } catch (error) {
      console.error("❌ Error removing admin role:", error);
      toast.error("Failed to remove admin role.");
    }
  };

  /** ✅ Handle Admin Profile Management */
  const handleEditAdmin = () => setEditingAdmin(true);

  const handleAdminInputChange = (e) => {
    setAdminProfile({ ...adminProfile, [e.target.name]: e.target.value });
  };

  const handleSaveAdminProfile = async () => {
    try {
      const token = sessionStorage.getItem("token"); // ✅ Ensure token exists
      if (!token) {
        toast.error("Authorization error. Please log in again.");
        return;
      }

      console.log("📡 Updating admin profile...", profileData);

      const response = await axiosInstance.put("/admin/update", profileData, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
      });

      console.log("✅ Profile updated successfully:", response.data);
      setAdminProfile(response.data); // ✅ Save updated profile
      setEditingAdmin(false); // ✅ Exit editing mode
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "❌ Error updating profile:",
        error.response?.data || error.message
      );
      toast.error("Failed to update profile. Try again.");
    }
  };

  /** ✅ Handle Product Management */
  const handleEditProduct = (product) => setEditingProduct({ ...product });

  const handleSaveProduct = async () => {
    if (
      !editingProduct?.name?.trim() ||
      !editingProduct?.price ||
      !editingProduct?.stock
    ) {
      return toast.error("Product name, price, and stock are required!");
    }

    try {
      await axiosInstance.put(
        `/admin/products/${editingProduct.product_id}`,
        editingProduct
      );
      toast.success("Product updated successfully!");
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error("❌ Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axiosInstance.delete(`/admin/products/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ Handle New Product Creation */
  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      await axiosInstance.post("/admin/product", newProduct);
      toast.success("Product added successfully!");
      fetchProducts();
      setNewProduct({
        name: "",
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
      console.error("❌ Error adding product:", error);
      toast.error("Failed to add product.");
    }
  };

  /** ✅ Handle Product Request Management */
  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    if (!window.confirm("Confirm Product Request Status???")) return;

    try {
      await axiosInstance.put(`/products/requests/update/${requestId}`, {
        status: newStatus,
      });
      toast.success(`Request ${newStatus} successfully!`);
      fetchProductRequests();
    } catch (error) {
      console.error("❌ Error updating request:", error);
      toast.error("Failed to update request.");
    }
  };

  const handleDeleteAllRequests = async () => {
    if (
      !window.confirm("Are you sure you want to delete ALL product requests?")
    )
      return;

    try {
      await axiosInstance.delete("/products/requests/delete-all");
      toast.success("✅ All product requests deleted.");
      setRequests([]); // ✅ Clear the state after deletion
    } catch (error) {
      console.error("❌ Error deleting all requests:", error);
      toast.error("Failed to delete all product requests.");
    }
  };

  /** ✅ Handle Downloading Product Requests */
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "letter",
    });
    doc.text("Product Requests", 14, 15);

    autoTable(doc, {
      head: [
        [
          "ID",
          "Email",
          "Product",
          "QTY.",
          "Status",
          "Address",
          "City",
          "State",
          "Requested",
        ],
      ],
      body: requests.map((request) => [
        request.id,
        request.user_email,
        request.product,
        request.quantity || "N/A",
        request.status,
        request.address || "N/A",
        request.city || "N/A",
        request.state || "N/A",
        new Date(request.requested_at).toLocaleString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      ]),
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 }, // Adjust font size if needed
      columnStyles: {
        0: { cellWidth: "auto" }, // ID
        1: { cellWidth: "auto" }, // User Email
        2: { cellWidth: "auto" }, // Product
        3: { cellWidth: "auto" }, // Quantity
        4: { cellWidth: "auto" }, // Status
        5: { cellWidth: "auto" }, // Address
        6: { cellWidth: "auto" }, // City
        7: { cellWidth: "auto" }, // State
        8: { cellWidth: "auto" }, // Country
        9: { cellWidth: "auto" }, // Requested At
      },
      overflow: "linebreak", // Ensures text doesn't overflow
    });
    // const fileName = requests.length > 0 ? `${requests[0].user_email}.pdf` : "Product_Requests.pdf";
    doc.save("Product Requests.pdf");
  };

  return (
    <div className="container mt-5">
      <h2 className="p-2">Admin Dashboard</h2>
      <div className="card mb-3">
        <h3 className="p-2">Admin Profile</h3>
        <div className="card-body">
          {editingAdmin ? (
            <>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={profileData.fullname}
                  onChange={handleAdminInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={profileData.email}
                  onChange={handleAdminInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={profileData.address}
                  onChange={handleAdminInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={profileData.city}
                  onChange={handleAdminInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={profileData.state}
                  onChange={handleAdminInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={profileData.country}
                  onChange={handleAdminInputChange}
                />
              </div>
              <button
                className="btn btn-success me-2"
                onClick={handleSaveAdminProfile}
              >
                Save Profile
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingAdmin(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h5 className="card-title">{adminProfile.fullname}</h5>
              <p className="card-text">
                <strong>Username:</strong> {adminProfile.username}
              </p>
              <p className="card-text">
                <strong>Email:</strong> {adminProfile.email}
              </p>
              <p className="card-text">
                <strong>Address:</strong>{" "}
                {adminProfile.address || "Not Provided"}
              </p>
              <p className="card-text">
                <strong>City:</strong> {adminProfile.city || "Not Provided"}
              </p>
              <p className="card-text">
                <strong>State:</strong> {adminProfile.state || "Not Provided"}
              </p>
              <p className="card-text">
                <strong>Country:</strong>{" "}
                {adminProfile.country || "Not Provided"}
              </p>
              <button className="btn btn-primary" onClick={handleEditAdmin}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
      <h3 className="p-2">Manage Users</h3>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Email</th>
              <th>ID</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {" "}
                <td>{user.email}</td>
                <td>{user.id}</td> {/* ✅ Display the correct user ID */}
                <td>{user.roles.join(", ")}</td>
                <td>
                  {user.roles.includes("admin") ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveAdmin(user.id, user.email)} // ✅ Using `id`
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleMakeAdmin(user.id, user.email)} // ✅ Using `id`
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Products Table with Delete Button */}
      <h3 className="p-2">Products</h3>
      <div className="table-responsive">
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
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditProduct(product)}
                    >
                      ✏️ Edit
                    </button>

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
      </div>
      {editingProduct && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />

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

                <label className="form-label mt-2">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  required
                ></textarea>

                <label className="form-label mt-2">Stripe Product ID</label>
                <input
                  type="text"
                  name="stripe_product_id"
                  value={editingProduct.stripe_product_id || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />

                <label className="form-label mt-2">Stripe Price ID</label>
                <input
                  type="text"
                  name="stripe_price_id"
                  value={editingProduct.stripe_price_id || ""}
                  onChange={handleInputChange}
                  className="form-control"
                />
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

                <label className="form-label mt-2">Release Date</label>
                <input
                  type="date"
                  name="release_date"
                  value={
                    editingProduct.release_date
                      ? new Date(editingProduct.release_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
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

      <div className="card p-3 mb-4 mt-5">
        <h3>Add New Product</h3>

        <label className="form-label">Product Name</label>
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleNewProductChange}
          className="form-control"
          required
        />

        <label className="form-label mt-2">Price ($)</label>
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleNewProductChange}
          className="form-control"
          required
        />

        <label className="form-label mt-2">Stock</label>
        <input
          type="number"
          name="stock"
          value={newProduct.stock}
          onChange={handleNewProductChange}
          className="form-control"
          required
        />

        <label className="form-label mt-2">Description</label>
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleNewProductChange}
          className="form-control"
        ></textarea>

        <label className="form-label mt-2">Image URL</label>
        <input
          type="text"
          name="image_url"
          value={newProduct.image_url}
          onChange={handleNewProductChange}
          className="form-control"
        />

        <label className="form-label mt-2">Stripe Product ID</label>
        <input
          type="text"
          name="stripe_product_id"
          value={newProduct.stripe_product_id}
          onChange={handleNewProductChange}
          className="form-control"
        />

        <label className="form-label mt-2">Stripe Price ID</label>
        <input
          type="text"
          name="stripe_price_id"
          value={newProduct.stripe_price_id}
          onChange={handleNewProductChange}
          className="form-control"
        />

        <label className="form-label mt-2">Is Presale?</label>
        <select
          name="is_presale"
          value={newProduct.is_presale}
          onChange={handleNewProductChange}
          className="form-select"
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>

        <label className="form-label mt-2">Release Date</label>
        <input
          type="date"
          name="release_date"
          value={newProduct.release_date}
          onChange={handleNewProductChange}
          className="form-control"
        />

        <button className="btn btn-success mt-3" onClick={handleCreateProduct}>
          ➕ Add Product
        </button>
      </div>

      <h3  className="py-3">Product Requests</h3>
      <div className="my-3">
        <button className="btn btn-success mb-3" onClick={handleDownloadPDF}>
          📄 Download Product Requests (PDF)
        </button>
      </div>
      <div className="mb-3">
        <button
          onClick={handleDeleteAllRequests}
          className="btn btn-danger my-2"
        >
          ❌ Delete All Requests
        </button>
      </div>
      <div className="table-responsive my-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length <= 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{request.user_email}</td>
                  <td>{request.product}</td>
                  <td>{request.quantity}</td>
                  <td>{request.status}</td>
                  <td>{new Date(request.requested_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() =>
                        handleUpdateRequestStatus(request.id, "Approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleUpdateRequestStatus(request.id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
