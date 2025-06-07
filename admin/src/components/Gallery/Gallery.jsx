import React, { useState, useEffect } from "react";
import "./Gallery.css";

const API_ORIGIN = "http://localhost:5000";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingImage, setEditingImage] = useState(null); // Edit state

  // Fetch gallery images
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_ORIGIN}/api/galaries/getGalaries`);
        const data = await res.json();
        setImages(data.data || []);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
      }
    })();
  }, []);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setLoading(true);

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", imageFile);
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
      const imageUrl = data.secure_url;

      const backendRes = await fetch(
        `${API_ORIGIN}/api/galaries/createGalary`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageUrl }),
        }
      );

      const json = await backendRes.json();
      if (!json.success) throw new Error(json.message);

      setImages((prev) => [...prev, json.data]);
      setShowModal(false);
      setImageFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUpload = async (e) => {
    e.preventDefault();
    if (!imageFile || !editingImage) return;

    setLoading(true);

    const cloudinaryData = new FormData();
    cloudinaryData.append("file", imageFile);
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
      const newImageUrl = data.secure_url;

      const backendRes = await fetch(
        `${API_ORIGIN}/api/galaries/updateGalary/${editingImage._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: newImageUrl }),
        }
      );

      const json = await backendRes.json();
      if (!json.success) throw new Error(json.message);

      setImages((prev) =>
        prev.map((img) => (img._id === editingImage._id ? json.data : img))
      );

      setShowModal(false);
      setImageFile(null);
      setEditingImage(null);
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const res = await fetch(`${API_ORIGIN}/api/galaries/deleteGalary/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete image");
    }
  };

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h2>Gallery</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditingImage(null);
            setImageFile(null);
            setShowModal(true);
          }}
        >
          + Add Image
        </button>
      </header>

      <div className="gallery-grid">
        {images.map((img) => (
          <div className="gallery-card" key={img._id}>
            <img src={img.image} alt="Gallery" className="gallery-img" />
            <div className="card-buttons">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditingImage(img);
                  setImageFile(null);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(img._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingImage ? "Edit Image" : "Upload Image"}</h3>
            <form onSubmit={editingImage ? handleEditUpload : handleUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <div className="modal-actions">
                <button type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : editingImage
                    ? "Update"
                    : "Upload"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingImage(null);
                    setImageFile(null);
                  }}
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

export default Gallery;
