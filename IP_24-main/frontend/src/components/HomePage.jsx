import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import data from "../assets/data.json";
import UserLogin from "./UserLogin";
import Summary from "./Summary";
import Payment from "./Payment";
import Cart from "./Cart";
import Home from "./Home";
import Orders from "./Orders";
import BrowseGames from './BrowseGames';
import TheTeam from './TheTeam';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setGames(data.storeGames);
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const addToCart = (game) => {
    setCart((prevCart) => {
      if (prevCart.find((item) => item.product_id === game.product_id)) {
        return prevCart;
      }
      return [...prevCart, game];
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentStep("home");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "home":
        return <Home games={games} addToCart={addToCart} goToTeam={() => setCurrentStep("team")} />;
      case "cart":
        return (
          <Cart
            cart={cart}
            setCart={setCart}
            onProceedToPayment={() => setCurrentStep("payment")}
            onBackToHome={() => setCurrentStep("home")}
          />
        );
      case "login":
        return (
          <UserLogin
            setStep={setCurrentStep}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setCurrentUser={setCurrentUser}
          />
        );
      case "summary":
        return (
          <Summary
            currentUser={currentUser}
            onBack={() => setCurrentStep("home")}
          />
        );
      case "payment":
        return (
          <Payment
            cart={cart}
            setStep={setCurrentStep}
            currentUser={currentUser}
            setCart={setCart}
          />
        );
      case "orders":
        return (
          <Orders
            onBack={() => setCurrentStep("home")}
            onLogout={handleLogout}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setIsLoggedIn={setIsLoggedIn}
          />
        );
      case "browse":
        return (
          <BrowseGames
            cart={cart}
            setCart={setCart}
            onBack={(step) => setCurrentStep(step)}
          />
        );
      case "team":
        return (<TheTeam />);
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="home-background">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="w-100 d-flex align-items-center justify-content-between px-3">
          <a className="navbar-brand" href="index.html">
            <img
              src="/JoystickJourneysLogo.png"
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-text-top"
            />
            Joystick Journeys
          </a>
          <div className="ms-auto d-flex gap-2 pe-4">
            {currentStep === "home" && (
              <>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCurrentStep("cart")}
                >
                  Cart ({cart.length})
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => setCurrentStep("login")}
                >
                  {isLoggedIn ? "Profile" : "Sign Up / Login"}
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={() => setCurrentStep("browse")}
                >
                  Browse Games
                </button>
              </>
            )}
            {currentStep !== "home" && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setCurrentStep("home")}
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content-wrapper px-4 my-4">
        {renderStep()}
      </div>

      <footer className="footer mt-auto py-3">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/JoystickJourneysLogo.png"
              alt="Joystick Journeys Logo"
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "#fff",
              }}
            />
            <span className="small text-dark">&copy; 2025 Joystick Journeys, Inc.</span>
          </div>
          <a
            href="#"
            className="footer-link mb-2 mb-md-0 text-decoration-none text-dark fw-semibold"
          >
            ↑ Back to top
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
