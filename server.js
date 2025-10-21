import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// 🧭 Your Render API endpoint
const TARGET_URL = "https://human-detection-y1pc.onrender.com/api/human-data";

// Proxy POST route
app.post("/api/human-data", async (req, res) => {
  try {
    console.log("📦 Incoming data from ESP32:", req.body);

    const response = await axios.post(TARGET_URL, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Data forwarded successfully!");
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("❌ Error forwarding data:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/", (req, res) => res.send("ESP32 HTTP Proxy is running 🚀"));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`🚀 HTTP Proxy running on port ${PORT}`));
