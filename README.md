# 🚀 BuddyScript — Scalable Full-Stack Social Feed Platform

<p align="center">
  <b>A production-ready social networking platform built for performance, security, and scale.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production Ready-success?style=for-the-badge" />
</p>

---

## 🌐 Live Demo & Resources

- 🔗 **Live App:** https://buddy-script.vercel.app *(update if needed)*
- 🎥 **Video Walkthrough:** *(Add link here)*
- 💻 **Repositories:**
  - Client: https://github.com/mahdee18/BuddyScript-client  
  - Server: https://github.com/mahdee18/BuddyScript-server  

---

## ✨ Key Highlights

- ⚡ Handles high-volume feeds efficiently (millions of reads/writes)
- 🔐 Zero-Trust security architecture
- 📊 Optimized database queries & indexing
- 🚀 Instant UI with optimistic updates
- 🧠 Real-world backend design patterns

---

## 🧠 System Design & Architecture

### ⚡ High-Performance Data Modeling

**Counter Pattern (O(1) Performance)**
- Uses precomputed counters (`likeCount`, `commentCount`)
- Eliminates expensive array traversal

**N+1 Query Prevention**
- Deep population strategy
- Fetches posts + users + comments + replies in a single query

**Database Indexing**
- Indexed `email`, `createdAt`
- Fast lookup and sorting at scale

---

### 🔐 Security (Zero-Trust Approach)

**Server-Driven Identity**
- JWT-based authentication
- No trust on frontend-provided IDs

**Password Protection**
- Bcrypt hashing (salt factor 10)
- Sensitive fields excluded (`select: false`)

**Brute-Force Protection**
- Rate limiting implemented
- IP-based request throttling

---

### 📈 Scalable UX Engineering

**Optimistic UI**
- Instant feedback for user actions
- Background server synchronization

**Dynamic Avatar System**
- Auto-generated initials-based avatars
- Consistent UI without uploads

---

## 🛠 Feature Breakdown

### 🔐 Authentication
- Secure signup & login
- JWT session persistence
- Protected routes

### 📰 Feed
- Create posts (text + images)
- Public / Private visibility

### 💬 Engagement
- Likes
- Comments
- Nested replies

### 👁 Transparency
- View all users who liked a post

---

## 🧩 Tech Stack

| Layer     | Technology |
|----------|-----------|
| Frontend | React.js, Tailwind CSS |
| Backend  | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth     | JWT |
| Security | BcryptJS, Express Rate Limit |
| Logging  | Morgan |
| Metrics  | Response-Time |

---

## ⚙️ Local Development Setup

```bash
# Clone repositories
git clone https://github.com/mahdee18/BuddyScript-client
git clone https://github.com/mahdee18/BuddyScript-server

# Setup backend environment variables (.env)
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

# Install dependencies
cd BuddyScript-client && npm install
cd ../BuddyScript-server && npm install

# Run development
npm run dev
```

---

## 📊 Performance Mindset

- O(1) engagement counters  
- Reduced database round-trips  
- Indexed queries  
- Stateless authentication  
- Scalable architecture  

---

## 🎯 Why This Project Matters

This is not just a CRUD app.

It demonstrates:
- Production-grade backend architecture  
- Secure system design  
- Performance optimization  
- Scalable thinking  

---

## 👨‍💻 Author

**Mahdee Al Amin**

- GitHub: https://github.com/mahdee18  
- LinkedIn: *https://www.linkedin.com/in/mahdee-al-amin/*  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 📌 Future Improvements

- 🔔 Real-time notifications (WebSockets)
- 📱 Better mobile responsiveness
- 🌍 Multi-language support
- 🧵 Infinite scrolling
- 🧠 AI-based recommendations

---

<p align="center">
  Built with 💻 and a focus on scalability.
</p>