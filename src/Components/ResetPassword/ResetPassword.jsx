import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoPersonOutline, IoArrowForwardCircleOutline } from "react-icons/io5";
import axios from "axios";
import "../CssComponent/resetPassword.css";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setUserId(e.target.value);
        if (error) setError(""); // Clear error when typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setError("Please enter your User ID.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("https://api.m2rtechnomations.com/v2/auth/forgot-password", {
                user_id: userId,
            });
            if (response.data.status === true) {
                const msg = response.data.message || "OTP has been sent to your registered email.";
                setSuccessMessage(msg);
                setShowSuccessPopup(true);

                // Auto-navigate after 3 seconds
                setTimeout(() => {
                    navigate("/reset-password-confirm", { state: { userId: userId } });
                }, 3000);
            } else {
                setError(response.data.message);
            }

        } catch (err) {
            console.error("Error sending OTP:", err);
            setError("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card">
                <div className="reset-header">
                    <h2>Forgot Password</h2>
                    <p>
                        Enter your User ID below to receive an OTP to reset
                        your password.
                    </p>
                </div>

                <form className="reset-form" onSubmit={handleSubmit}>
                    <div className="reset-field">
                        <label htmlFor="userId">User ID</label>
                        <div className="input-wrapper-forgot">
                            <span className="input-icon-reset">
                                <IoPersonOutline />
                            </span>
                            <input
                                type="text"
                                id="userId"
                                placeholder="Enter your User ID"
                                value={userId}
                                onChange={handleChange}
                                autoFocus
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="reset-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                        {!loading && <IoArrowForwardCircleOutline size={22} />}
                    </button>
                </form>

                <Link to="/" className="back-to-login">
                    &larr; Back to Login
                </Link>
            </div>

            {/* Modern Success Popup */}
            {showSuccessPopup && (
                <div className="success-popup-overlay">
                    <div className="success-popup-card">
                        <div className="success-popup-icon">
                            <IoArrowForwardCircleOutline size={50} />
                        </div>
                        <h3>Check Your Email</h3>
                        <p className="success-popup-text">
                            {successMessage}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;