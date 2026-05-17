"use client";

import { useState } from "react";
import Link from "next/link";

export default function AccountClient() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Login successful!");
        localStorage.setItem("customer_token", data.token);
        window.location.href = "/account/dashboard";
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Account created! Please login.");
        setIsLogin(true);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <Link href="/" className="back-link">← Back to Store</Link>
          <h1>DVND Account</h1>
        </div>

        <div className="account-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form className="account-form" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Login to access your account</p>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {message && <p className="form-message">{message}</p>}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="form-footer">
              <a href="#">Forgot password?</a>
            </p>
          </form>
        ) : (
          <form className="account-form" onSubmit={handleSignup}>
            <h2>Create Account</h2>
            <p className="form-subtitle">Join DVND — Two Forces. One Label.</p>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="John"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            {message && <p className="form-message">{message}</p>}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </button>

            <p className="form-footer">
              By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}