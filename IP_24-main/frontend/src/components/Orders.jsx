import React, { useEffect, useState } from "react";

const Orders = ({ onBack, onLogout, currentUser, setCurrentUser, setIsLoggedIn }) => {
  
  const [orders, setOrders] = useState([]);
  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    if (currentUser?.id) {
      fetch(`${API_BASE}/api/orders/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error("Error fetching orders:", err));
    }
  }, [currentUser]);
  
  return (
  <div className="!w-full !max-w-2xl !mx-auto !bg-white !rounded-2xl !shadow-xl !p-8 !mt-8">
    {/* Username, Delete, and Logout Button */}
    <div className="!flex !items-center !justify-between !mb-6">
      <h2 className="!text-xl !font-bold !text-[#75164f]">
        {currentUser ? `Welcome, ${currentUser.username}!` : "Profile"}
      </h2>
      <div className="!flex !justify-end !gap-4 !mb-6">
        <button
            className="!bg-white !border !border-[#7b2cbf] !text-[#7b2cbf] !rounded-md !py-2 hover:!bg-[#7b2cbf] hover:!text-white !transition"
            onClick={async () => {
                if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
                try {
                const res = await fetch(`http://localhost:8080/api/users/${currentUser.id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    // Log out and clear user info
                    localStorage.removeItem("currentUser");
                    setCurrentUser(null);
                    setIsLoggedIn(false);
                    onBack();
                    alert("Your account has been deleted.");
                } else {
                    const err = await res.json();
                    alert("Error: " + (err.message || "Failed to delete account."));
                }
                } catch (err) {
                alert("Error: " + err.message);
                }
            }}
            >
            Delete Account
        </button>
        <button
            className="!bg-[#75164f] !text-white !rounded-md !px-4 !py-2 hover:!bg-[#5a1040] !transition"
            onClick={onLogout}
        >
            Logout
        </button>
      </div>
    </div>

    <h3 className="!text-2xl !font-bold !mb-6 !text-center !text-[#75164f]">Order History</h3>
    {orders.length === 0 ? (
      <p className="!text-center !text-gray-500">No orders yet.</p>
    ) : (
      <ul className="!space-y-6">
        {orders.map((order, idx) => (
          <li key={idx} className="!border !rounded-lg !p-4">
            <div className="!mb-2">
              <span className="!font-semibold">Date:</span> {order.date}
            </div>
            
            <div className="!mb-2">
              <span className="!font-semibold">Shipping Information:</span>
              <div className="!ml-4">
                <div>{order.customerName}</div>
                <div>{order.address}</div>
                <div>Payment: {order.cardNumber}</div>
              </div>
            </div>
            
            <div className="!mb-2">
              <span className="!font-semibold">Games:</span>
              <ul className="!list-disc !list-inside !ml-4">
                {order.games.map((g, i) => (
                  <li key={i}>{g.product_name} ({g.price})</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="!font-semibold">Total Price:</span> ${order.price}
            </div>
          </li>
        ))}
      </ul>
    )}
    <button
      className="!w-full !bg-white !border !border-[#7b2cbf] !text-[#7b2cbf] !rounded-md !py-2 hover:!bg-[#7b2cbf] hover:!text-white !transition !mt-8"
      onClick={onBack}
    >
      ←
    </button>
  </div>
);
};


export default Orders;