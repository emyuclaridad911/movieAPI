if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- Check ENV variable ---
console.log("MONGODB_STRING:", process.env.MONGODB_STRING);

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Now connected to MongoDB Atlas."))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const movieRoutes = require("./routes/movie");
const userRoutes = require("./routes/user");

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

// Start server
const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 API is now online on port ${PORT}`);
  });
}

module.exports = { app, mongoose };