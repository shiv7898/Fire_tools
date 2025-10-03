import { useState } from "react";
import "../Components/CssComponent/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(props) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://192.168.14.78:8000/v2/users/login",
      {
        user_id: form.username,
        password: form.password,
        platform: "web",
      }
    );

    console.log("Login Response:", response.data);

    if (response.data) {
      // ✅ Save access_token in localStorage
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }

      // ✅ Pass response to parent component
      if (props.getData) {
        props.getData(response.data);
      }

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    }
  } catch (err) {
    setError("Login failed. Please try again.");
    console.error("Login error:", err);
  }
};


  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        <div className="login-field">
          <label htmlFor="username">User ID</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
