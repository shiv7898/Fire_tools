import React, { useState } from "react";
import axios from "axios";
import "./Demo.css";

const UploadForm = () => {
  const [form, setForm] = useState({
    title: "",
    version: "",
    description: "",
    note: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", form.title);
    formData.append("version", form.version);
    formData.append("description", form.description);
    formData.append("note", form.note);

    try {
      const res = await axios.post("http://192.168.14.39:8000/v2/esp/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Upload successful!");
      console.log("Response:", res.data);
    } catch (err) {
      setMessage("❌ Upload failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="upload-card">
      <h2>Upload Data</h2>
      <form onSubmit={handleSubmit}>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} required />

        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Version:</label>
        <input
          type="text"
          name="version"
          value={form.version}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Note:</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UploadForm;
