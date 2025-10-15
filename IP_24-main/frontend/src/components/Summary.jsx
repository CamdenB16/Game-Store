import React, { useEffect, useState } from "react";

const Summary = ({ currentUser, onBack }) => {
  const [order, setOrder] = useState(null);
  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    if (currentUser?.id) {
      fetch(`${API_BASE}/api/orders/${currentUser.id}`)
        .then(res => res.json())
        .then(data => data.length > 0 ? setOrder(data[0]) : null);
    }
  }, [currentUser]);

  return (
    <div className="!w-full !max-w-2xl !mx-auto !bg-white !rounded-2xl !shadow-xl !p-8 !mt-8">
      <h2 className="!text-2xl !font-bold !mb-6 !text-center !text-[#75164f] underline">
        Order Confirmation
      </h2>
      <div className="!mb-6 !text-center">
        <span className="!font-semibold">Thank you, </span>
        <span className="!text-[#75164f] !font-semibold">
          {currentUser && currentUser.username ? currentUser.username : "Guest"}
        </span>
        <span className="!font-semibold">, for your purchase!</span>
      </div>
      {order ? (
        <div className="!mb-8">
          <div className="!mb-4 !p-4 !border !rounded-lg">
            <h3 className="!font-bold !text-[#75164f] !mb-2">Order Details</h3>
            <div className="!mb-2">
              <span className="!font-semibold">Date:</span> {order.date}
            </div>
            <div className="!mb-2">
              <span className="!font-semibold">Total Price:</span> ${order.price}
            </div>
          </div>
          
          <div className="!mb-4 !p-4 !border !rounded-lg">
            <h3 className="!font-bold !text-[#75164f] !mb-2">Customer Information</h3>
            <div className="!mb-2">
              <span className="!font-semibold">Name:</span> {order.customerName}
            </div>
            <div className="!mb-2">
              <span className="!font-semibold">Address:</span> {order.address}
            </div>
            <div className="!mb-2">
              <span className="!font-semibold">Payment Method:</span> {order.cardNumber}
            </div>
          </div>
          
          <div className="!mb-4 !p-4 !border !rounded-lg">
            <h3 className="!font-bold !text-[#75164f] !mb-2">Purchased Items</h3>
            <ul className="!list-disc !list-inside !ml-4">
              {order.games.map((g, i) => (
                <li key={i}>
                  {g.product_name} ({g.price})
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="!text-center !text-gray-500 !mb-8">
          No order information available.
        </div>
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

export default Summary;