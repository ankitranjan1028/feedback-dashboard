# Dynamic Form Builder & Analytics Platform

A comprehensive full-stack application built with the MERN stack, enabling organizations to create custom forms, collect user responses, and gain insights through powerful analytics dashboards.

## 🌟 Overview

This platform streamlines the process of creating, distributing, and analyzing forms. Whether you're collecting customer feedback, conducting surveys, or gathering user data, our solution provides an end-to-end experience with real-time analytics and intuitive form management.

---

## ✨ Key Features

### 🔐 Authentication & Security
- Secure user registration and login system
- JWT-based authentication with protected routes
- Password encryption using industry-standard hashing

### 📋 Form Management
- Intuitive drag-and-drop form builder
- Support for multiple question types (text, multiple choice, etc.)
- Real-time form preview and editing
- Automatic form validation

### 🔗 Distribution & Sharing
- Generate unique public URLs for each form
- Easy link sharing with one-click copy functionality
- Anonymous form submission (no login required for users)
- Mobile-optimized form filling experience

### 📊 Analytics & Insights
- Real-time response tracking and monitoring
- Interactive dashboard with key performance metrics
- Visual data representation using charts and graphs
- Response analytics with filtering and sorting options

### 💾 Data Management
- Comprehensive response viewing in organized tables
- Export functionality for offline analysis (CSV format)
- Data persistence with MongoDB integration
- Real-time updates and synchronization

### 🎨 User Experience
- Modern, responsive design that works on all devices
- Dark/light theme support with smooth transitions
- Intuitive notification system for user feedback
- Loading states and error handling for seamless interaction

---

## 🛠️ Technology Stack

### Frontend (Client)
- **React 18+** - Modern component-based architecture
- **Tailwind CSS** - Utility-first styling framework
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Recharts** - Interactive data visualization
- **Heroicons** - Beautiful, customizable icons

### Backend (Server)
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **Papa Parse** - CSV parsing and generation

---

## 📁 Project Architecture

```
form-builder-platform/

└── client/                   # Frontend application
    ├── package.json
    ├── tailwind.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/           # Route components
        ├── context/         # React Context providers
        ├── hooks/           # Custom React hooks
        ├── utils/           # Utility functions
        ├── api/             # API service layer
        ├── App.js
        └── index.js

├── server/                    # Backend application
│   ├── package.json
│   ├── index.js              # Server entry point
│   ├── .env                  # Environment variables
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── formController.js
│   │   └── responseController.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Form.js
│   │   └── Response.js
│   └── routes/              # API endpoints
│       ├── auth.js
│       ├── forms.js
│       └── responses.js

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB installation)
- Git for version control

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone //github.com/ankitranjan1028/feedback-dashboard.git
   cd feedback-dashboard
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

3. **Client Setup**
   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**
   
   **Terminal 1 (Server):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 (Client):**
   ```bash
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000` with the API running on `http://localhost:5000`.

---

### Security Best Practices
- **Input Validation**: Both client and server-side validation
- **Authentication**: Secure JWT implementation with proper token management
- **Data Protection**: Encrypted passwords and secure data transmission
- **CORS Configuration**: Proper cross-origin resource sharing setup

---

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Form Management
- `GET /api/forms` - Get user's forms
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get specific form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Response Handling
- `GET /api/forms/:id/responses` - Get form responses
- `POST /api/forms/:id/responses` - Submit form response
- `GET /api/responses/:id/export` - Export responses as CSV

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
