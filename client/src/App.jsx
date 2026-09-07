import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = () => {
    if (password.length === 0) {
      return "";
    }

    if (password.length < 8) {
      return "Weak";
    }

    if (
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "Strong";
    }

    return "Medium";
  };

  const fetchDashboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        setDashboardData(result);
      } else {
        setMessage(result.message);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Dashboard request failed:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLogin && username.trim() === "") {
      setMessage("Username is required");
      return;
    }

    if (email.trim() === "") {
      setMessage("Email is required");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters");
      return;
    }

    setMessage("");
    setIsLoading(true);

    const endpoint = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";

    const data = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      setMessage(result.message);

      if (isLogin && response.ok) {
        setIsLoggedIn(true);
        fetchDashboard();
      }

      if (!isLogin && response.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include"
      });

      const result = await response.json();

      setMessage(result.message);
      setIsLoggedIn(false);
      setDashboardData(null);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="page dashboard-page">
        <div className="background-grid"></div>

        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="brand">
              <div className="brand-icon">S</div>

              <div>
                <h2>SecureAuth</h2>
                <span>Security Console</span>
              </div>
            </div>

            <div className="auth-status">
              <span className="status-dot"></span>
              Authenticated
            </div>
          </header>

          <main className="dashboard-content">
            <section className="welcome-section">
              <span className="eyebrow">SECURE SESSION</span>

              <h1>Welcome back.</h1>

              <p>
                Your identity has been successfully verified and your
                authenticated session is active.
              </p>
            </section>

            <section className="dashboard-grid">
              <div className="info-card user-card">
                <div className="card-icon">◉</div>

                <div>
                  <span className="card-label">USER ID</span>
                  <h3>
                    {dashboardData?.user?.id || "Authenticated User"}
                  </h3>
                </div>
              </div>

              <div className="info-card">
                <div className="card-icon">@</div>

                <div>
                  <span className="card-label">EMAIL</span>
                  <h3>
                    {dashboardData?.user?.email || "Verified account"}
                  </h3>
                </div>
              </div>
            </section>

            <section className="security-card">
              <div className="security-title">
                <div className="shield-icon">✓</div>

                <div>
                  <h3>Security Controls Active</h3>
                  <p>Your session is protected by SecureAuth.</p>
                </div>
              </div>

              <div className="security-list">
                <div>
                  <span>✓</span>
                  JWT authentication
                </div>

                <div>
                  <span>✓</span>
                  HttpOnly session cookie
                </div>

                <div>
                  <span>✓</span>
                  Protected API endpoint
                </div>
              </div>
            </section>

            <button className="logout-btn" onClick={handleLogout}>
              <span>↪</span>
              Sign out securely
            </button>
          </main>

          <footer className="dashboard-footer">
            SecureAuth • Secure authentication demonstration
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="background-grid"></div>

      <div className="auth-layout">
        <section className="intro-section">
          <div className="brand">
            <div className="brand-icon">S</div>

            <div>
              <h2>SecureAuth</h2>
              <span>Identity & Access</span>
            </div>
          </div>

          <div className="intro-content">
            <span className="eyebrow">SECURITY FIRST</span>

            <h1>
              Authentication built
              <span> with security in mind.</span>
            </h1>

            <p>
              A secure authentication system demonstrating modern
              authentication, protected sessions, and database security.
            </p>

            <div className="security-points">
              <div>
                <span>✓</span>
                <p>
                  <strong>Protected passwords</strong>
                  <small>Secure password hashing with bcrypt</small>
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  <strong>Secure sessions</strong>
                  <small>JWT authentication with HttpOnly cookies</small>
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  <strong>Attack protection</strong>
                  <small>Validation, rate limiting and SQLi prevention</small>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="mobile-brand">
            <div className="brand-icon">S</div>
          </div>

          <div className="form-header">
            <span className="form-badge">
              {isLogin ? "WELCOME BACK" : "NEW ACCOUNT"}
            </span>

            <h2>
              {isLogin ? "Sign in to SecureAuth" : "Create your account"}
            </h2>

            <p>
              {isLogin
                ? "Enter your credentials to access your secure dashboard."
                : "Create a secure account to get started."}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label htmlFor="username">Username</label>

                <div className="input-wrapper">
                  <span className="input-icon">◉</span>

                  <input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">@</span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>

                {isLogin && (
                  <span className="secure-label">Secure login</span>
                )}
              </div>

              <div className="input-wrapper">
                <span className="input-icon">◆</span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {!isLogin && password && (
                <div className="strength-container">
                  <div className="strength-bars">
                    <span
                      className={
                        getPasswordStrength() !== "Weak"
                          ? "active"
                          : "active weak"
                      }
                    ></span>

                    <span
                      className={
                        getPasswordStrength() === "Medium" ||
                        getPasswordStrength() === "Strong"
                          ? "active"
                          : ""
                      }
                    ></span>

                    <span
                      className={
                        getPasswordStrength() === "Strong"
                          ? "active"
                          : ""
                      }
                    ></span>
                  </div>

                  <span className="strength-text">
                    {getPasswordStrength()} password
                  </span>
                </div>
              )}
            </div>

            <button
              className="primary-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isLogin
                ? "Sign in securely"
                : "Create secure account"}

              {!isLoading && <span>→</span>}
            </button>
          </form>

          {message && (
            <div className="message">
              <span>✓</span>
              {message}
            </div>
          )}

          <div className="switch-container">
            <span>
              {isLogin
                ? "Don't have a SecureAuth account?"
                : "Already have an account?"}
            </span>

            <button
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>

          <div className="form-footer">
            <span>🔒</span>
            Your credentials are securely processed
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
