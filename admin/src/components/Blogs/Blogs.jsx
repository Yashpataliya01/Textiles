import React, { useEffect, useState } from "react";
import "./Blogs.css";

const API_ORIGIN = "http://localhost:5000";

const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    imageFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBlogs();
  }, []);

  const getBlogs = async () => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/blogs/getBlogs`);
      const json = await res.json();
      setBlogData(json.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", author: "", description: "", imageFile: null });
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      description: blog.description,
      imageFile: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_ORIGIN}/api/blogs/deleteBlog/${id}`, {
        method: "DELETE",
      });
      getBlogs();
    } catch (error) {
      console.log("Delete failed", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

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
        imageUrl = data.url;
      } catch (error) {
        console.log("Cloudinary upload failed", error);
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        ...(imageUrl && { image: imageUrl }),
      };

      const url = editingId
        ? `${API_ORIGIN}/api/blogs/updateBlog/${editingId}`
        : `${API_ORIGIN}/api/blogs/createBlog`;

      await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      getBlogs();
      closeModal();
    } catch (error) {
      console.log("Submit failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blogs-container">
      <h1 className="blogs-title">Latest Blogs</h1>
      <button onClick={() => setShowForm(true)} className="add-blog-button">
        Add Blog
      </button>
      <div className="blogs-list">
        {blogData.map((blog) => (
          <div key={blog?._id} className="blog-card">
            {blog?.image && (
              <img src={blog.image} alt="Blog" className="blog-img" />
            )}
            <h2 className="blog-title">{blog?.title}</h2>
            <p className="blog-meta">
              By <span>{blog?.author}</span>
            </p>
            <p className="blog-content">
              {blog?.description?.length > 250
                ? blog.description.slice(0, 250) + "..."
                : blog.description}
            </p>
            <div className="blog-actions">
              <button onClick={() => handleEdit(blog)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingId ? "Edit Blog" : "Add New Blog"}</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Blog"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
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

export default Blogs;
