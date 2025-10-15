import React from "react";

const Cart = ({ cart, setCart, onProceedToPayment, onBackToHome }) => {
  const subtotal = cart.reduce((total, item) => total + Number(item.price), 0);
  const tax = subtotal * 0.07;
  const finalTotal = subtotal + tax;

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 text-white">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center">Your cart is currently empty.</div>):(
        <>
          <div className="list-group mb-4">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{item.product_name}</h5>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold">${Number(item.price).toFixed(2)}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.product_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p className="card-text d-flex justify-content-between">
                <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
              </p>
              <p className="card-text d-flex justify-content-between">
                <span>Tax (7%):</span> <span>${tax.toFixed(2)}</span>
              </p>
              <hr />
              <p className="card-text d-flex justify-content-between fw-bold">
                <span>Total:</span> <span>${finalTotal.toFixed(2)}</span>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
        <button
          className="btn btn-success"
          onClick={onProceedToPayment}
          disabled={cart.length === 0}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Cart;
