import React, { useEffect, useState } from "react";
import "./Home.css";
import "../main/main.css";
import { Link } from "react-router-dom";

const Home = () => {
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
                <Link
                  to={`/main/${c._id}`}
                  state={{ categoryName: c._id, name: c.name }}
                >
                  <button className="view-more-btn">View</button>
                </Link>
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
