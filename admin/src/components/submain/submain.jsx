// src/components/Main.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../home/home.css";

const API_ORIGIN = "http://localhost:5000";

const submain = () => {
  const { id } = useParams();
  const location = useLocation();
  const { categoryName, productId, categoryId } = location.state || {};

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
    (async () => {
      try {
        const url = `${API_ORIGIN}/api/subproducts/getSubProducts${
          productId ? `?productId=${encodeURIComponent(productId)}` : ""
        }`;
        const res = await fetch(url);
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    })();
  }, []);

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
      imageFile: null, // keep null unless user selects new
    });
    setShowForm(true);
  };

  // Delete
  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        `${API_ORIGIN}/api/subproducts/deleteSubProduct/${_id}`,
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

    let imageUrl = "";

    // Step 1: Upload image to Cloudinary if selected
    if (formData.imageFile) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", formData.imageFile);
      cloudinaryData.append("upload_preset", "Project"); // Replace with your actual preset
      cloudinaryData.append("cloud_name", "dlxhhxkdg"); // Replace with your Cloudinary name

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
        return;
      }
    }

    // Step 2: Submit subproduct data to your backend
    const payload = {
      name: formData.name,
      description: formData.description,
      product: id,
      image: imageUrl, // Cloudinary image URL
    };

    const url = editingId
      ? `${API_ORIGIN}/api/subproducts/updateSubProduct/${editingId}`
      : `${API_ORIGIN}/api/subproducts/createSubProduct`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");

      const saved = json.data;
      setProducts((prev) => {
        return editingId
          ? prev.map((p) => (p._id === editingId ? saved : p))
          : [...prev, saved];
      });

      // Reset form
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", description: "", imageFile: null });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
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
        {products.map((prod) => {
          const imgSrc = prod.image.startsWith("http")
            ? prod.image
            : `${API_ORIGIN}${prod.image}`;
          return (
            <div key={prod._id} className="card">
              <div
                className="card-image"
                style={{ backgroundImage: `url(${imgSrc})` }}
              />
              <div className="card-content">
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>

                <div className="card-buttons">
                  <button className="edit-btn" onClick={() => openEdit(prod)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(prod._id)}
                  >
                    Delete
                  </button>
                  <Link
                    to={`/main/${categoryId}/${productId}/${prod._id}`}
                    state={{
                      categoryName: prod.name,
                      productId: prod._id,
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
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Name:</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
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
                  // required only when adding
                  required={!editingId}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingId ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default submain;
