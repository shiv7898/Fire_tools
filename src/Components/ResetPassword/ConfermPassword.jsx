import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    IoLockClosedOutline,
    IoEyeOutline,
    IoEyeOffOutline,
    IoCheckmarkCircle,
    IoKeypadOutline
} from "react-icons/io5";
import "../CssComponent/resetPassword.css";

const ConfermPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [strength, setStrength] = useState("");
    const [userId, setUserId] = useState("");
    const [timer, setTimer] = useState(600); // 10 minutes timer

    useEffect(() => {
        if (location.state && location.state.userId) {
            setUserId(location.state.userId);
        } else {
            // Ideally redirect back if no userId, but for testing we stay or warn
            // navigate("/reset-password");
        }
    }, [location, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    navigate("/reset-password");
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError("");

        if (name === "newPassword") {
            checkStrength(value);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const checkStrength = (password) => {
        if (password.length === 0) {
            setStrength("");
            return;
        }
        if (password.length < 6) {
            setStrength("Weak");
        } else if (password.length < 10) {
            setStrength("Medium");
        } else {
            setStrength("Strong");
        }
    };

    const getStrengthColor = () => {
        if (strength === "Weak") return "strength-weak";
        if (strength === "Medium") return "strength-medium";
        if (strength === "Strong") return "strength-strong";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { otp, newPassword, confirmPassword } = formData;

        if (!otp || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);

        try {
            // DUMMY API: Post to jsonplaceholder to simulate password reset
            const response = await axios.post("/v2/auth/reset-password", {
                user_id: userId,
                otp: otp,
                new_password: newPassword
            });

            console.log("Reset Password Response:", response.data);
            if (response.data.status === true) {
                setError(response.data.message);
            } else {
                setError(response.data.message);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {
            console.error("Reset error:", err);
            setError("Failed to reset password. Please verify OTP and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            {/* Toast Notification */}
            <div className={`toast-notification ${success ? "show" : ""}`}>
                <div className="toast-icon">
                    <IoCheckmarkCircle />
                </div>
                <div className="toast-message">Password updated successfully</div>
            </div>

            <div className="reset-card">
                <div className="reset-header">
                    <h2>Reset Password</h2>
                    <p>Enter the OTP sent to your email and set a new password.</p>
                    <p className="timer-display" style={{ marginTop: "10px", fontWeight: "bold", color: timer < 60 ? "#d9534f" : "inherit" }}>
                        OTP Expires in: {formatTime(timer)}
                    </p>
                </div>

                <form className="reset-form" onSubmit={handleSubmit}>
                    {/* OTP Field */}
                    <div className="reset-field">
                        <label htmlFor="otp">OTP Code</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <IoKeypadOutline />
                            </span>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="Enter OTP code"
                                value={formData.otp}
                                onChange={handleChange}
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="reset-field">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <IoLockClosedOutline />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                        {strength && (
                            <div className={`password-strength ${getStrengthColor()}`}>
                                Strength: {strength}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="reset-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">
                                <IoLockClosedOutline />
                            </span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="reset-btn" disabled={loading}>
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>

                <Link to="/" className="back-to-login">
                    &larr; Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ConfermPassword;