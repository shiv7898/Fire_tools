import { useEffect, useState } from "react";
import "./CssComponent/profileView.css";
import { FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

export default function ProfileView({ dataResponse }) {
  console.log("dataResponsewswd", dataResponse);
  const [user, setUser] = useState(null);
  console.log("userdattjh", user);
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
      wifiModule: dataResponse?.subscription.wifiMode?"Active":"Inactive",
    });

    if (dataResponse?.subscription?.generated_at) {
      const result = calculateSubscription(
        dataResponse.subscription.generated_at,dataResponse.subscription.time_period
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
  <FaRegUser/>
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

          <button className="edit-btn">
            <FaEdit size={14} />
          </button>
        </div>

        {/* 🔹 Account Details */}
        <div className="card">
          <h4>Account Details</h4>
          <p className="item">
            <strong>User ID:</strong> {user.userId}
          </p>
          <p className="item">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        {/* 🔹 Subscription Details */}
        <div className="card subscription-details">
          <h4>Subscription Details</h4>

          <div className="grid">
            <p className="item">
              <span className="key">Subscription:</span>
              <span className="value">
                {user.subscription?.status ? "Active" : "Inactive"}
              </span>
            </p>

            <p className="item">
              <span className="key">Plan Type: </span>
              <span className="value">Premium</span>
            </p>

            <p className="item">
              <span className="key">Product ID: </span>
              <span className="value">{user.subscription?.product_id}</span>
            </p>

            <p className="item wifi">
              <span className="key">WiFi Module:</span>
              <span className="value">{user.wifiModule}</span>
            </p>

            <p className="item">
              <span className="key">Generated:</span>
              <span className="value">
                {subscriptionInfo.startDate.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </p>
            <p className="item">
              <span className="key">Duration:</span>
              <span className="value">
                {user.subscription?.time_period} Days
              </span>
            </p>

            <p className="item">
              <span className="key">Days Left:</span>
              <span className="value">{subscriptionInfo.daysLeft} Days</span>
            </p>

            <p className="item">
              <span className="key">Expires In:</span>
              <span className="value">
                {subscriptionInfo.monthsLeft} Months
              </span>
            </p>
          </div>
        </div>
        {/* 🔔 Expiry Warning Popup */}
        {showExpiryPopup && (
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
        )}
      </main>
    </div>
  );
}
