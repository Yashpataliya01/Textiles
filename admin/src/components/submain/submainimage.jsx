import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../home/home.css";

const API_ORIGIN = "http://localhost:5000";

const SubMainImage = () => {
  const location = useLocation();
  const { categoryName, productId } = location.state || {};

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    imageFile: null,
  });

  // Fetch products once
  useEffect(() => {
    (async () => {
      try {
        const url = `${API_ORIGIN}/api/subproducts/getSubProductImage${
          productId ? `?productId=${encodeURIComponent(productId)}` : ""
        }`;
        const res = await fetch(url);
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    })();
  }, [productId]);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ imageFile: null });
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] || null }));
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const res = await fetch(
        `${API_ORIGIN}/api/subproducts/deleteSubProductImage/${_id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p._id !== _id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Could not delete product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    // Upload to Cloudinary
    if (formData.imageFile) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", formData.imageFile);
      cloudinaryData.append("upload_preset", "kw7egjc8");
      cloudinaryData.append("cloud_name", "dzw7kcrs4");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dzw7kcrs4/image/upload",
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
        setLoading(false);
        return;
      }
    }

    // Submit to backend
    const payload = {
      image: imageUrl,
      subProduct: productId,
    };

    console.log("Payload:", editingId);
    const url = editingId
      ? `${API_ORIGIN}/api/subproducts/updateSubProductImage/${editingId}`
      : `${API_ORIGIN}/api/subproducts/uploadSubProductImage`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");

      const saved = json.data;
      setProducts((prev) =>
        editingId
          ? prev.map((p) => (p._id === editingId ? saved : p))
          : [...prev, saved]
      );

      setShowForm(false);
      setEditingId(null);
      setFormData({ imageFile: null });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
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
        {products?.map((prod) => {
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
                <div className="card-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(prod._id);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(prod._id)}
                  >
                    Delete
                  </button>
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
              {editingId && (
                <div style={{ marginBottom: "10px" }}>
                  <strong>Current Image:</strong>
                  <img
                    src={
                      products
                        .find((p) => p._id === editingId)
                        ?.image.startsWith("http")
                        ? products.find((p) => p._id === editingId)?.image
                        : `${API_ORIGIN}${
                            products.find((p) => p._id === editingId)?.image
                          }`
                    }
                    alt="Current"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}

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
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
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

export default SubMainImage;
