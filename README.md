# Project Features

---

## 🚀 Features Implemented

### 1. Admin Authentication System
- **Admin Signup**:  
  - Endpoint: `POST /api/admin/signup`  
  - Allows registration of new admin users.
- **Admin Login**:  
  - Endpoint: `POST /api/admin/login`  
  - Authenticates existing admins.
- **Password Security**:  
  - Passwords are hashed securely using **bcrypt** before storage in MongoDB.
- **JWT Authentication**:  
  - Generates **JSON Web Tokens (JWTs)** upon successful login for secure session management.

---

### 2. Protected Routes
- **Authentication Middleware**:  
  - Verifies JWT tokens for each request.
- **Admin-only Access**:  
  - Restricts sensitive routes to admins with valid credentials.

---

### 3. Gemini AI Integration
- **Recommendation Endpoint**:  
  - Endpoint: `POST /api/recommendations`  
  - Provides course or content recommendations.
- **User Preferences**:  
  - Accepts user inputs such as topics and skill level.  
- **API Integration**:  
  - Structured for integration with **Gemini AI API** (API key placeholder included).

---

### 4. Course Management
- **Upload Endpoint**:  
  - Endpoint: `POST /api/courses/upload`  
  - Supports uploading of course data.

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT, bcrypt  
- **AI Integration**: Gemini AI (API-ready structure)  

---

## 🔐 Security
- Passwords are never stored in plain text.  
- JWT tokens are used for session management and authorization.  
- Sensitive routes are protected by middleware.

---

## 📌 Future Improvements
- Add role-based access control (RBAC).  
- Extend Gemini AI integration with real API key and advanced recommendation logic.  
- Implement course update and delete endpoints.  
- Add unit and integration tests.

---
