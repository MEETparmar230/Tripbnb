
# 🏡 TripBNB – Airbnb Clone (MERN Stack)

TripBNB is a full-stack web application inspired by Airbnb, built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It allows users to browse listings, post their own stays, leave reviews, and much more.

## 🔗 Live Demo

- **Frontend (Vercel):** https://tripbnb-sand.vercel.app
- **Backend (Render):**  https://tripbnb.onrender.com/

---

## 🌟 Features

- 🧾 User registration & login with **Passport.js**
- 🏠 Create, read, update, and delete **listings**
- 📸 Upload listing images using **Cloudinary**
- 🌍 Location-based search with **Mapbox**
- 💬 Users can post **reviews**
- 🔐 Sessions handled using **express-session** & **connect-mongo**
- 🧪 Input validation with **Joi**
- 💅 Styled with **TailwindCSS** and **Material UI**
- ⚙️ CORS, error handling, environment configs, and more

---

## 🧠 Tech Stack

### Frontend
- React
- React Router DOM
- Tailwind CSS
- Material UI
- Axios
- Mapbox GL JS
- Vite

### Backend
- Express.js
- MongoDB Atlas
- Mongoose
- Passport + Passport-Local + Passport-Local-Mongoose
- Express-Session
- Cloudinary + Multer
- Connect-Mongo
- Joi
- Dotenv

---

## 📁 Project Structure

```
/Front-end      --> React frontend
/Back_end       --> Express backend
```

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/MEETparmar230/tripbnb.git
   cd tripbnb
   ```

2. **Backend Setup**
   ```bash
   cd Back_end
   npm install
   npm start
   ```

   Create a `.env` file in `/Back_end` with:
   ```
   MONGODB=your_mongo_uri
   SECRET=your_session_secret
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_KEY=xxx
   CLOUDINARY_SECRET=xxx
   ```

3. **Frontend Setup**
   ```bash
   cd Front_end
   npm install
   npm run dev
   ```

---

## 🙌 Acknowledgements

- 🧑‍🏫 Guided by **Shraddha madam** from **Apna College** through their Web Dev Course.
- 🧠 Thanks to **ChatGPT** for helping debug and improve the project throughout development.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
