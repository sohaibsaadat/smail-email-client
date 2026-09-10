# 📧 Smail — Modern Email Application

Smail is a full-stack email application inspired by modern email platforms like Gmail. It allows users to send and receive emails, manage multiple mail folders, search emails, upload attachments, and receive real-time notifications.

The project is built with **React.js, Node.js, Express.js, PostgreSQL, and Socket.IO**, with a focus on real-world email functionality and a responsive user experience.

## 🚀 Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes
* Secure password hashing

### 📩 Email Management

* Send and receive emails
* To, CC and BCC support
* Email subject and body
* Email attachments
* Sent emails
* Star/unstar emails
* Read/unread email status
* Delete and restore emails
* Multiple email folders

### 📂 Mail Folders

* 📥 Inbox
* 📤 Sent
* ⭐ Starred
* 🗑️ Trash
* 📦 All Mail

### 🔎 Email Search

Search emails using:

* Sender
* Subject
* Email body
* Attachments

Search works within the user's available mail data.

### ⚡ Real-Time Notifications

Smail uses **Socket.IO** to provide real-time email notifications.

When a user receives a new email, the application can update the interface without requiring a page reload.

### 📎 File Attachments

Users can attach files to emails.

Attachments are uploaded and stored using **Cloudinary**, while their metadata is maintained in PostgreSQL.

### 🎨 Responsive UI

The frontend is designed to provide a clean and responsive experience across desktop and smaller screens.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Material UI
* Axios
* React Toastify
* Context API
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Socket.IO

### Database

* PostgreSQL

### Cloud Services

* Cloudinary — file storage
* Railway — backend deployment/database hosting
* Vercel — frontend deployment

---

## 🏗️ Architecture

```text
Smail
│
├── Frontend
│   └── React.js
│       ├── React Router
│       ├── Context API
│       ├── Material UI
│       └── Axios
│
├── Backend
│   └── Node.js + Express.js
│       ├── Authentication
│       ├── Email APIs
│       ├── File Uploads
│       └── Socket.IO
│
├── Database
│   └── PostgreSQL
│
└── Cloud Storage
    └── Cloudinary
```

## 🗄️ Database Structure

The application uses PostgreSQL with tables including:

* `users`
* `emails`
* `email_receivers`
* `email_attachments`

The database structure is designed to support multiple recipients, CC/BCC, email states, folders, read/unread status, starring, deletion, and attachments.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/sohaibsaadat/smail-email-client.git
cd smail
```

### 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the backend

```bash
npm run server
```

### 5. Run the frontend

```bash
npm run dev
```

---

## 🔑 Authentication Flow

```text
User Signup
     ↓
Account Verified
     ↓
Login
     ↓
JWT Token
     ↓
Protected Email Features
```

---

## 📧 Email Flow

```text
Sender
   ↓
Compose Email
   ↓
To / CC / BCC
   ↓
Backend API
   ↓
PostgreSQL
   ↓
Receiver Inbox
   ↓
Socket.IO Notification
```

---

## 🎯 Project Goals

Smail was built to practice and demonstrate real-world full-stack development concepts, including:

* REST API development
* Authentication & authorization
* PostgreSQL database design
* Relational database relationships
* Real-time communication
* File uploads
* Cloud storage
* Search functionality
* State management
* Protected routes
* Full-stack deployment

---

## 🌐 Live Demo

**Live Demo:** `https://smail-email-client.vercel.app`

---

## 👨‍💻 Author

**Sohaib Ali**

Full Stack Developer 

Built with ❤️ using React, Node.js, Express, PostgreSQL & Socket.IO.
