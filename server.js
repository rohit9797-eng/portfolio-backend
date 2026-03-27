import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* Test route */
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

/* Contact API */
app.use("/api/contact", contactRoutes);

// /* MongoDB connection */
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.log(err));

let isConnected = false;

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}


/* Middleware */
app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongoDB();
  }
  next();
});

// /* Server */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

module.exports = app;