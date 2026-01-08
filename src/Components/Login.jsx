import { useState } from "react";
import "../Components/CssComponent/login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

function Login(props) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

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
        "https://api.m2rtechnomations.com/v2/users/login",
        {
          user_id: form.username,
          password: form.password,
          platform: "web",
        }
      );

      console.log("Login Response:", response.data);

      if (response.data) {
        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }

        if (props.getData) {
          props.getData(response.data);
        }

        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
   <div className="login-container">
     <div className="login-bg">
     

      <div className="login-logo-ui">
         <div className="logo-top">
        <div className="logo-circle">
          <img src="/img/app_icon.png" alt="App Logo" className="app-logo" />
        </div>
      </div>
        <div className="welcome-text">Welcome To</div>
        <div className="signin-text">M2R Connect</div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login Your Account</h2>

        <div className="login-field">
          <label htmlFor="username">User ID</label>
          <div className="input-icon-wrapper">
            <span className="input-icon user-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.59 21C20.2 17.59 16.97 15 12 15C7.03 15 3.8 17.59 3.41 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="login-field password-field">
          <label htmlFor="password">Password</label>

          <div className="input-icon-wrapper password-input">
            <span className="input-icon pass-icon" aria-hidden>
              <svg width="16" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 11V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline/>}
            </button>
          </div>
        </div>

        <div className="below-password-row">
          <div className="forgot">Forgot Password?</div>
          <div className="help">Need help?</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
   </div>
  );
}

export default Login;
