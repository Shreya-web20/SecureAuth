const express = require("express");

require("dotenv").config();
const db = require("./db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "https://secureauth-frontend-jdj9.onrender.com"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

app.get("/", (req, res) => {
  res.send("SecureAuth backend is running");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error("Registration database error:", err);

        return res.status(500).json({
          message: "Registration failed"
        });
      }

      return res.status(201).json({
        message: "User registered successfully"
      });
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed"
    });
  }
});

app.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login database error:", err);

      return res.status(500).json({
        message: "Login failed"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 1000
      });

      return res.json({
        message: "Login successful"
      });
    } catch (error) {
      console.error("Authentication error:", error);

      return res.status(500).json({
        message: "Login failed"
      });
    }
  });
});

app.get("/dashboard", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Please login."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      message: "Welcome to SecureAuth Dashboard",
      user: decoded
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    path: "/"
  });

  return res.json({
    message: "Logged out successfully"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});