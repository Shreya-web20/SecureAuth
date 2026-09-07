# SecureAuth

SecureAuth is a full-stack authentication system built to demonstrate secure authentication practices and common web application security concepts.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- HttpOnly cookie-based authentication
- Protected dashboard endpoint
- Client-side and server-side validation
- Parameterized SQL queries for SQL injection prevention
- Login rate limiting
- Password strength indicator
- Secure logout
- Responsive security-focused UI

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Security
- bcrypt
- JSON Web Token (JWT)
- HttpOnly Cookies
- Parameterized SQL Queries
- Express Rate Limit

## Project Structure

```text
SecureAuth/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── .gitignore
│
└── README.md
```

## Security Implementation

### Password Hashing
- Passwords are hashed using bcrypt before being stored in the database. Plain-text passwords are never stored.

### SQL Injection Prevention
- Database queries use parameterized placeholders instead of directly concatenating user input into SQL queries.

### JWT Authentication
- After successful login, the server generates a JWT containing authenticated user information.

### HttpOnly Cookie
- The JWT is stored in an HttpOnly cookie so that client-side JavaScript cannot directly access the authentication token.

### Rate Limiting
- Login requests are rate-limited to reduce repeated authentication attempts.

### Input Validation
- User input is validated on both the frontend and backend before processing.

### Password Strength
- The registration form provides a password strength indicator to give users feedback about the strength of their chosen password.


## Dtabase Setup
Create the database:

CREATE DATABASE secureauth;
USE secureauth;


Create the users table: 

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


## Environment Variables

Create a .env file inside the server directory:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=secureauth
JWT_SECRET=your_jwt_secret

Do not commit the .env file to Github.


## Running the Project

### Start the Backend

Open a terminal in the server directory:

npm install
node server.js

The backend runs on:

http://localhost:5000 


### Start the Frontend

Open a terminal in the client directory:

npm install
npm run dev

The frontend will run on the Vite development server.


## Security Testing

The application was tested for:

- Successful registration and login
- Duplicate email handling
- Invalid credentials
- Protected endpoint access
- Logout and session invalidation
- Login rate limiting
- SQL injection attempts using parameterized queries
- Password hashing verification


## Disclaimer

SecureAuth is a learning and demonstration project created to showcase authentication, database security, and common web application security concepts. It is not intended to represent a production-ready authentication system.


## Author
Shreya Singh
