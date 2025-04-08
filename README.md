# 💳 CyberSecure Dashboard

> A beginner-friendly full-stack FinTech + Cybersecurity web app that lets users check card usage, stay updated with cybersecurity news, and learn best practices — all while protecting sensitive data using encryption.

---

## 🚀 Features

- 🛡 **User Authentication** (Register, Login, Logout)
- 🔐 **Secure Password Storage** using Bcrypt
- 💳 **Card Usage Checker** (with MongoDB storage & encryption)
- 📰 **Live Cybersecurity News Feed** (auto-updates every 5 seconds)
- 🧠 **Security Tips** & Training Resources
- 📷 **Animated Backgrounds** via Unsplash API
- 📱 **Fully Responsive UI**
- ⚙️ **Under Construction Page** with rotating aesthetic backgrounds

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, EJS, JavaScript, GSAP
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Security**: bcrypt.js, encryption for card data
- **APIs**:
  - [NewsAPI](https://newsapi.org) – for latest cybersecurity news
  - [Unsplash API](https://unsplash.com/developers) – for rotating anime backgrounds

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/rajaryan0x1/csa
cd cybersecure-dashboard

# Install dependencies
npm install
```



Create a .env file in the root directory and add the following:

```bash
MONGO_URI=your_mongodb_connection_string
NEWS_API_KEY=your_newsapi_key
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
ENCRYPTION_PASSWORD=YOURSUPERSECRETPASSWORD
JWT_PASSWORD=PASSW03D
```

P.S - I don't know why I've named JWT_PASSWORD even though I'm not using it 😅
