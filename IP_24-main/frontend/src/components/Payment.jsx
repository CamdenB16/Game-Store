import React, { useState } from "react";

const Payment = ({ cart, setStep, setCart, currentUser}) => {
  const [payInfo, setPayInfo] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const API_BASE = "http://localhost:8080";
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


  const handleChange = (event) => {
    const { name, value } = event.target;
    let newValue = value;

    if (name === "cardNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 16);
      newValue = newValue.match(/.{1,4}/g)?.join("-") || "";
    }

    if (name === "expiry") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
      if (newValue.length >= 3) {
        newValue = newValue.slice(0, 2) + "/" + newValue.slice(2);
      }
    }

    if (name === "cvv") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPayInfo({ ...payInfo, [name]: newValue });
  };

  const validate = () => {
    const newErrors = {};
    const cleanCard = payInfo.cardNumber.replace(/-/g, "");

    if (!payInfo.name) newErrors.name = "Name is required";
    if (!payInfo.email || !/\S+@\S+\.\S+/.test(payInfo.email)) newErrors.email = "Valid email is required";
    if (!payInfo.address) newErrors.address = "Address is required";
    if (!/^\d{16}$/.test(cleanCard)) newErrors.cardNumber = "Card number must be 16 digits";
    if (!/^\d{2}\/\d{2}$/.test(payInfo.expiry)) newErrors.expiry = "Expiry must be MM/YY";
    if (!/^\d{3}$/.test(payInfo.cvv)) newErrors.cvv = "CVV must be 3 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const mockProcessPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate 2-second payment processing delay
      await delay(2000);
      
      const orderData = {
        games: [...cart],
        date: new Date().toLocaleString(),
        price: total.toFixed(2),
        customerName: payInfo.name,
        address: payInfo.address,
        cardNumber: `xxxx-xxxx-xxxx-${payInfo.cardNumber.slice(-4)}`,
        userId: currentUser?.id || null
      };

      await submitOrder(orderData);
      setCart([]);
      setStep("summary");
    } catch (err) {
      alert("Error processing payment: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitOrder = async (order) => {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      mockProcessPayment();
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return (
    <div className="container my-5 text-white">
      <h2 className="text-center mb-4">Payment Information</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={payInfo.name}
            onChange={handleChange}/>
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={payInfo.email}
            onChange={handleChange}/>
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="col-12">
          <label className="form-label">Shipping Address</label>
          <input
            type="text"
            name="address"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            value={payInfo.address}
            onChange={handleChange}/>
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            className={`form-control ${errors.cardNumber ? "is-invalid" : ""}`}
            value={payInfo.cardNumber}
            onChange={handleChange}
            placeholder="1234-5678-9012-3456"/>
          {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Expiry (MM/YY)</label>
          <input
            type="text"
            name="expiry"
            className={`form-control ${errors.expiry ? "is-invalid" : ""}`}
            value={payInfo.expiry}
            onChange={handleChange}
            placeholder="MM/YY"/>
          {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">CVV</label>
          <input
            type="text"
            name="cvv"
            className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
            value={payInfo.cvv}
            onChange={handleChange}
            placeholder="123"/>
          {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
        </div>

        <div className="col-12 mt-4">
          <h5>Order Total: ${total.toFixed(2)}</h5>
        </div>

        <div className="col-12 text-center">
          <button type="submit" className="btn btn-success w-100" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Complete Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;