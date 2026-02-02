import { useEffect, useState } from "react";
import "./CssComponent/profileView.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaRegUser,
  FaCalendarAlt,
  FaWifi,
  FaCrown,
  FaFingerprint,
  FaClock,
  FaHourglassHalf,
  FaCalendarTimes,
} from "react-icons/fa";
import { MdEmail, MdOutlineCardMembership } from "react-icons/md";

export default function ProfileView({ dataResponse }) {
  console.log("Profile Data Response.....:", dataResponse);

  const [user, setUser] = useState(null);

  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);

  /* 🔹 Calculate subscription info dynamically */
  const calculateSubscription = (generatedAt, totalDays) => {
    // ✅ Remove microseconds (.963721 → .963)
    const safeDateString = generatedAt.split(".")[0] + "Z";

    const startDate = new Date(safeDateString);
    console.log("Correct start date:", startDate);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + totalDays);

    const today = new Date();

    const diffTime = endDate - today;
    const daysLeft = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);

    const monthsLeft = Math.max(Math.ceil(daysLeft / 30), 0);

    const progress = Math.min(
      Math.round(((totalDays - daysLeft) / totalDays) * 100),
      100
    );

    return {
      startDate,
      endDate,
      daysLeft,
      monthsLeft,
      progress,
    };
  };

  /* 🔹 Set user & subscription data */
  useEffect(() => {
    if (!dataResponse) return;

    setUser({
      name: dataResponse?.name,
      email: dataResponse?.email,
      status: dataResponse?.status ? "Active" : "Inactive",
      userId: dataResponse?.user_id,
      subscription: dataResponse?.subscription,
      ProductId: dataResponse?.subscription.product_id,
      totalDays: dataResponse?.subscription.time_period,
      wifiModule: dataResponse?.subscription.wifiMode ? "Active" : "Inactive",
    });

    if (dataResponse?.subscription?.generated_at) {
      const result = calculateSubscription(
        dataResponse.subscription.generated_at, dataResponse.subscription.time_period
      );

      setSubscriptionInfo(result);

      if (result.daysLeft <= 15 && result.daysLeft > 0) {
        setShowExpiryPopup(true);
      }
    }
  }, [dataResponse]);

  if (!user || !subscriptionInfo)
    return <div className="loading">Loading profile...</div>;

  return (
    <div className="dashboard">
      <main className="content">
        {/* 🔹 Profile Header */}
        <div className="card header">
          <div className="avatar">
            {/* <img src="/img/app_icon.png" alt="App Icon" /> */}
            <FaRegUser />
          </div>

          <div className="info">
            <h3>{user.name}</h3>
            <p>
              <MdEmail size={14} /> {user.email}
            </p>
            <span className={`status  ${user.status ? "active" : ""}`}>
              <FaCheckCircle size={14} /> {user.status}
            </span>
          </div>

          {/* <button className="edit-btn">
            <FaEdit size={14} />
          </button> */}
        </div>

        {/* 🔹 Account Details */}
        {/* <div className="card">
          <h4>Account Details</h4>
          <p className="item">
            <strong>User ID:</strong> {user.userId}
          </p>
          <p className="item">
            <strong>Email:</strong> {user.email}
          </p>
        </div> */}

        {/* 🔹 Subscription Details */}
        {/* 🔹 Subscription Details */}
        <div className="card subscription-details">
          <div className="section-header">
            <MdOutlineCardMembership className="header-icon" />
            <h4>Subscription Details</h4>
          </div>

          <div className="details-grid">
            {/* Status */}
            <div
              className={`detail-item ${user.subscription?.status ? "status-active" : "status-inactive"
                }`}
            >
              <div className="item-icon-box">
                {user.subscription?.status ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
              </div>
              <div className="item-info">
                <span className="item-label">Subscription Status</span>
                <span className="item-value">
                  {user.subscription?.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Plan Type */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaCrown />
              </div>
              <div className="item-info">
                <span className="item-label">Plan Type</span>
                <span className="item-value">Premium</span>
              </div>
            </div>

            {/* Product ID */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaFingerprint />
              </div>
              <div className="item-info">
                <span className="item-label">Product ID</span>
                <span className="item-value">
                  {user.subscription?.product_id}
                </span>
              </div>
            </div>

            {/* WiFi Module */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaWifi />
              </div>
              <div className="item-info">
                <span className="item-label">WiFi Module</span>
                <span className="item-value">{user.wifiModule}</span>
              </div>
            </div>

            {/* Generated Date */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaCalendarAlt />
              </div>
              <div className="item-info">
                <span className="item-label">Generated Date</span>
                <span className="item-value">
                  {subscriptionInfo.startDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaClock />
              </div>
              <div className="item-info">
                <span className="item-label">Duration</span>
                <span className="item-value">
                  {user.subscription?.time_period} Days
                </span>
              </div>
            </div>

            {/* Days Left */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaHourglassHalf />
              </div>
              <div className="item-info">
                <span className="item-label">Days Left</span>
                <span className="item-value">{subscriptionInfo.daysLeft} Days</span>
              </div>
            </div>

            {/* Expiry */}
            <div className="detail-item">
              <div className="item-icon-box">
                <FaCalendarTimes />
              </div>
              <div className="item-info">
                <span className="item-label">Expires In</span>
                <span className="item-value">
                  {subscriptionInfo.monthsLeft} Months
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* 🔔 Expiry Warning Popup */}
        {/* {showExpiryPopup && (
          <div className="expiry-popup-overlay">
            <div className="expiry-popup">
              <h3>⚠️ Subscription Expiring Soon</h3>

              <p>
                Your subscription will expire in{" "}
                <strong>{subscriptionInfo.daysLeft} days</strong>.
              </p>

              <p>Please renew your plan to avoid service interruption.</p>

              <button
                className="popup-btn"
                onClick={() => setShowExpiryPopup(false)}
              >
                OK, Got it
              </button>
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}
