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
        "https://cors-anywhere.herokuapp.com/https://api.m2rtechnomations.com/user/login",
        {
          userId: form.username,
          password: form.password,
        }
      );

      console.log("Login Response:", response.data);

      if (response.data) {
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
