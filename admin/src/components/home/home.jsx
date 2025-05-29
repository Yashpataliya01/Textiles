import React, { useEffect, useState } from "react";
import "./Home.css";
import "../main/main.css";
import { Link } from "react-router-dom";

const Home = () => {
  // const [categories, setCategories] = useState(categoriesCache || []);
  // const [showForm, setShowForm] = useState(false);
  // const [formData, setFormData] = useState({ name: "", image: "" });
  // const [editingId, setEditingId] = useState(null);
  // const [loading, setLoading] = useState(false);
  // // Fetch categories once
  // useEffect(() => {
  //   if (categoriesCache === null) {
  //     (async () => {
  //       try {
  //         const res = await fetch(
  //           "http://localhost:5000/api/categories/getCategories"
  //         );
  //         const json = await res.json();
  //         const data = json.data || [];
  //         categoriesCache = data;
  //         setCategories(data);
  //         console.log(data);
  //       } catch (err) {
  //         console.error("Error fetching categories:", err);
  //       }
  //     })();
  //   }
  // }, []);

  // const openAdd = () => {
  //   setEditingId(null);
  //   setFormData({ name: "", image: "" });
  //   setShowForm(true);
  // };

  // const openEdit = (cat) => {
  //   setEditingId(cat._id);
  //   setFormData({ name: cat.name, image: cat.image });
  //   setShowForm(true);
  // };

  // const handleDelete = async (_id) => {
  //   if (!window.confirm("Delete this category?")) return;
  //   try {
  //     const res = await fetch(
  //       `http://localhost:5000/api/categories/deleteCategory/${_id}`,
  //       { method: "DELETE" }
  //     );
  //     const json = await res.json();
  //     if (!json.success) throw new Error("Delete failed");
  //     const updated = categories.filter((c) => c._id !== _id);
  //     categoriesCache = updated;
  //     setCategories(updated);
  //   } catch (err) {
  //     console.error("Delete error:", err);
  //     alert("Could not delete category");
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((p) => ({ ...p, [name]: value }));
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData((p) => ({ ...p, image: file }));
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     let imageUrl = formData.image;
  //     // Upload to Cloudinary if file object
  //     if (formData.image && typeof formData.image !== "string") {
  //       const data = new FormData();
  //       data.append("file", formData.image);
  //       data.append("upload_preset", "Project"); // Change this
  //       data.append("cloud_name", "dlxhhxkdg"); // Change this

  //       const cloudRes = await fetch(
  //         "https://api.cloudinary.com/v1_1/dlxhhxkdg/image/upload",
  //         {
  //           method: "POST",
  //           body: data,
  //         }
  //       );

  //       const cloudData = await cloudRes.json();
  //       imageUrl = cloudData.secure_url;
  //     }

  //     const finalFormData = {
  //       ...formData,
  //       image: imageUrl,
  //     };

  //     const url = editingId
  //       ? `http://localhost:5000/api/categories/updateCategory/${editingId}`
  //       : "http://localhost:5000/api/categories/createCategory";
  //     const method = editingId ? "PUT" : "POST";

  //     const res = await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(finalFormData),
  //     });

  //     const json = await res.json();
  //     if (!res.ok) throw new Error(json.message || "Save failed");

  //     const cat = json.data;
  //     const updated = editingId
  //       ? categories.map((c) => (c._id === editingId ? cat : c))
  //       : [...categories, cat];

  //     categoriesCache = updated;
  //     setCategories(updated);
  //     setShowForm(false);
  //     setEditingId(null);
  //     setFormData({ name: "", image: "" });
  //     setLoading(false);
  //   } catch (err) {
  //     console.error("Save error:", err);
  //     alert(err.message);
  //   }
  // };

  const data = [
    {
      name: "Suitings",
      image:
        "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      _id: "00001",
    },
    {
      name: "Shirtings",
      image:
        "https://images.unsplash.com/photo-1647013629840-13c441a3221b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      _id: "00002",
    },
  ];

  return (
    <div className="home-container">
      <header className="header">
        <h1>Fabric Library</h1>
        <div className="divider">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="line" />
        </div>
        <p className="tagline">
          "Explore Our Finest Collection of Shirting, Suiting, & Knits"
        </p>
      </header>

      <div className="cards-container">
        {data.map((c) => (
          <div
            key={c._id}
            className="card"
            style={{ backgroundImage: `url(${c.image})` }}
          >
            <div className="card-content">
              <h2>{c.name}</h2>
              <div
                className="card-divider"
                style={{ backgroundColor: c.accentColor || "#333" }}
              />
              <div className="card-buttons">
                <Link to={`/main/${c._id}`} state={{ categoryName: c._id }}>
                  <button className="view-more-btn">View</button>
                </Link>
                {/* <button onClick={() => openEdit(c)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="delete-btn"
                >
                  Delete
                </button> */}
              </div>
            </div>
          </div>
        ))}

        {/* <div className="subcategory-card add-card" onClick={openAdd}>
          <div className="add-icon">+</div>
        </div> */}
      </div>

      {/* {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
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
                  {editingId
                    ? loading
                      ? "Saving..."
                      : "Save Changes"
                    : loading
                    ? "Saving..."
                    : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Home;
