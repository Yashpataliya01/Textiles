import React, { useEffect, useState } from "react";
import "./Home.css";
import "../main/main.css";
import { Link } from "react-router-dom";

const API_ORIGIN = "http://localhost:5000";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    imageFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ORIGIN}/api/categories/getCategories`);
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddForm = () => {
    setFormData({ name: "", image: "", imageFile: null });
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, image: cat.image, imageFile: null });
    setEditingId(cat._id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(
        `${API_ORIGIN}/api/categories/deleteCategory/${id}`,
        {
          method: "DELETE",
        }
      );
      const json = await res.json();
      if (json.success) fetchCategories();
      else alert(json.message);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      if (formData.imageFile) {
        const cloudData = new FormData();
        cloudData.append("file", formData.imageFile);
        cloudData.append("upload_preset", "kw7egjc8");
        cloudData.append("cloud_name", "dzw7kcrs4");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dzw7kcrs4/image/upload",
          { method: "POST", body: cloudData }
        );
        const uploadJson = await uploadRes.json();
        if (!uploadJson.secure_url) throw new Error("Image upload failed");
        imageUrl = uploadJson.secure_url;
      }

      const endpoint = editingId
        ? `${API_ORIGIN}/api/categories/updateCategory/${editingId}`
        : `${API_ORIGIN}/api/categories/createCategory`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, image: imageUrl }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message);
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", image: "", imageFile: null });
      setError("");
      fetchCategories();
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Save failed");
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Fabric Library</h1>
        <div className="divider">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="line"></span>
        </div>
        <p className="tagline">
          Explore Our Finest Collection of Shirting, Suiting, & Knits
        </p>
        <button className="add-category-btn" onClick={openAddForm}>
          + Add Category
        </button>
      </header>

      {loading ? (
        <p>Loading categories…</p>
      ) : (
        <div className="cards-container">
          {categories.map((c) => (
            <div
              key={c._id}
              className="card"
              style={{ backgroundImage: `url(${c.image})` }}
            >
              <div className="card-content">
                <h2>{c.name}</h2>
                <div className="card-buttons">
                  <Link
                    to={`/main/${c._id}`}
                    state={{ categoryName: c.name, categoryId: c._id }}
                  >
                    <button className="view-more-btn">View</button>
                  </Link>
                  <button className="edit-btn" onClick={() => handleEdit(c)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Category" : "Add Category"}</h2>
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
                  type="text"
                  name="name"
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imageFile: e.target.files[0],
                      image: "",
                    })
                  }
                  required={!editingId}
                />
                {formData.imageFile && (
                  <img
                    src={URL.createObjectURL(formData.imageFile)}
                    alt="Preview"
                    className="preview-image"
                  />
                )}
                {!formData.imageFile && formData.image && (
                  <img
                    src={formData.image}
                    alt="Current"
                    className="preview-image"
                  />
                )}
              </div>

              {error && <p className="error-message">{error}</p>}

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingId ? "Save Changes" : "Add Category"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
