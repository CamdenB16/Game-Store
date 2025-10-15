import React, { useState, useEffect } from "react";

const UserLogin = ({ setStep, isLoggedIn, setIsLoggedIn, setCurrentUser }) => {
  const [page, setPage] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({ username: "", password: "" });

  const API_BASE = "http://localhost:8080";
  const registerUser = async (username, password) => {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  };
  
  const loginUser = async (username, password) => {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  };




  const handleLoginChange = e => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSignupChange = e => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setError("");
  };

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(loginData.username, loginData.password);
      setError("");
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoggedIn(true);
      setCurrentUser(user);
      setStep("orders");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await registerUser(signupData.username, signupData.password);
      setError("");
      alert("Account created!");
      setPage("login");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // User is already logged in, redirect to orders
      setStep("orders");
    }
  }, [isLoggedIn, setStep]);
  
  // Only render login form if not already logged in
  if (isLoggedIn) {
    return null; // Don't render anything while redirecting
  }


  return (
    <div className="min-h-screen flex items-center justify-center !-mt-20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 flex flex-col items-center">
        {page === "login" ? (
          <>
          <h1 className="mb-6 text-3xl font-bold  text-center underline text-[#75164f]">
            Login
          </h1>
            <form className="w-full" onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#75164f] transition"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  autoComplete="username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#75164f] transition"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  autoComplete="current-password"
                />
              </div>
              <button
                className="!w-full !py-2 !rounded-md !bg-[#5629c1] !text-white !font-semibold hover:!bg-[#422295] !transition !mb-4"
                type="submit"
              >
                Sign In
              </button>
            </form>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-600">Don't have an account?</span>
              <button
                className="!bg-transparent !border !border-[#7b2cbf] !text-[#7b2cbf] !text-sm !font-semibold !px-2 !py-1 !rounded-md hover:!bg-[#7b2cbf] hover:!text-white !transition"
                onClick={() => {
                  setError("");
                  setPage("signup");
                }}
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
          <h1 className="mb-6 text-3xl font-bold underline text-center">
            Register
          </h1>
            <form className="w-full" onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#75164f] transition"
                  name="username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  autoComplete="username"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#75164f] transition"
                  name="password"
                  type="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  autoComplete="new-password"
                />
              </div>
              <button
                className="!w-full !py-2 !rounded-md !bg-[#5629c1] !text-white !font-semibold hover:!bg-[#422295] !transition !mb-4"
                type="submit"
              >
                Sign Up
              </button>
            </form>
            <button
              className="!w-full !bg-white !border !border-[#7b2cbf] !text-[#7b2cbf] !rounded-md !py-2 hover:!bg-[#7b2cbf] hover:!text-white !transition"
              onClick={() => {
                setError("");
                setPage("login");
              }}
            >
              Back
            </button>
          </>
        )}
        {error && (<div className="!w-full !mb-2 !mt-4 !text-center !text-red-600 !font-semibold">{error}</div>)}
      </div>
    </div>
  );
};

export default UserLogin;