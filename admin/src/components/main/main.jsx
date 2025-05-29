// src/components/Main.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./main.css";

const API_ORIGIN = "http://localhost:5000";

const Main = () => {
  const { id } = useParams();
  const location = useLocation();
  const { categoryName } = location.state || {};

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null,
  });

  // Fetch products once
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const url = `${API_ORIGIN}/api/products/getProducts${
        categoryName ? `?category=${encodeURIComponent(categoryName)}` : ""
      }`;

      const res = await fetch(url);
      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Open modal for Add or Edit
  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", imageFile: null });
    setShowForm(true);
  };

  const openEdit = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      imageFile: null,
    });
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        `${API_ORIGIN}/api/products/deleteProduct/${_id}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!json.success) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p._id !== _id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete product");
    }
  };

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, imageFile: e.target.files[0] || null }));
  };

  // Submit for both create & update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading at the start

    try {
      let imageUrl = "";

      // Step 1: Upload image to Cloudinary if selected
      if (formData.imageFile) {
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", formData.imageFile);
        cloudinaryData.append("upload_preset", "Project");
        cloudinaryData.append("cloud_name", "dlxhhxkdg");

        try {
          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dlxhhxkdg/image/upload",
            {
              method: "POST",
              body: cloudinaryData,
            }
          );
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error?.message || "Image upload failed");
          }

          imageUrl = data.secure_url;
        } catch (err) {
          console.error("Cloudinary Upload Error:", err);
          alert("Image upload failed: " + err.message);
          setLoading(false); // Reset loading on error
          return;
        }
      }

      // Step 2: Prepare product data for your backend
      const payload = {
        name: formData.name,
        description: formData.description,
        category: id,
        image: imageUrl,
      };

      const url = editingId
        ? `${API_ORIGIN}/api/products/updateProduct/${editingId}`
        : `${API_ORIGIN}/api/products/createProduct`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Save failed");
      }

      const saved = json.data;

      // Update products state
      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p._id === editingId ? saved : p))
          : [...prev, saved]
      );

      // Reset form and close modal
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", description: "", imageFile: null });

      // Show success message
      alert(
        editingId
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
    } catch (err) {
      alert(err.message || "An error occurred while saving the product");
    } finally {
      setLoading(false);
      getData();
    }
  };

  // Close modal handler
  const closeModal = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", imageFile: null });
    setLoading(false); // Reset loading when closing
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>{categoryName}</h1>
        <div className="divider">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="line" />
        </div>
        <p className="tagline">Select a product or add a new one</p>
      </header>

      <div className="cards-container">
        {products?.map((prod) => {
          const imgSrc = prod?.image.startsWith("http")
            ? prod?.image
            : `${API_ORIGIN}${prod?.image}`;
          return (
            <div key={prod?._id} className="card">
              <div
                className="card-image"
                style={{ backgroundImage: `url(${imgSrc})` }}
              />
              <div className="card-content">
                <h3>{prod?.name}</h3>
                <p>{prod?.description}</p>

                <div className="card-buttons">
                  <button className="edit-btn" onClick={() => openEdit(prod)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(prod?._id)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/main/${id}/${prod?._id}`}
                    state={{
                      categoryName: prod?.name,
                      productId: prod?._id,
                      categoryId: categoryName,
                    }}
                  >
                    <button className="view-more-btn">View</button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        <div className="subcategory-card add-card" onClick={openAdd}>
          <div className="add-icon">+</div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <select
                  name="name"
                  id="name"
                  className="form_cetogory"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">--Select--</option>
                  {categoryName === "00001" ? (
                    <>
                      <option value="2/18 (MATTY)">2/18 (MATTY)</option>
                      <option value="TROVIN / TASHA">TROVIN / TASHA</option>
                      <option value="KHAKHI POLICE UNIFORM">
                        KHAKHI POLICE UNIFORM
                      </option>
                      <option value="GABERDINE/ TWILL/ SERGE">
                        GABERDINE/ TWILL/ SERGE
                      </option>
                      <option value="LYCRA COLLECTION">LYCRA COLLECTION</option>
                      <option value="DESIGN TWILL">DESIGN TWILL</option>
                    </>
                  ) : (
                    <>
                      <option value="Shirting">Shirting</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image File:</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingId}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
