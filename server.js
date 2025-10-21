// import express from "express";
// import axios from "axios";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(bodyParser.json());

// // 🧭 Your Render API endpoint
// const TARGET_URL = "https://human-detection-y1pc.onrender.com/api/human-data";

// // Proxy POST route
// // app.post("/api/human-data", async (req, res) => {
// //   try {
// //     console.log("📦 Incoming data from ESP32:", req.body);

// //     const response = await axios.post(TARGET_URL, req.body, {
// //       headers: { "Content-Type": "application/json" },
// //     });

// //     console.log("✅ Data forwarded successfully!");
// //     res.status(response.status).json(response.data);
// //   } catch (error) {
// //     console.error("❌ Error forwarding data:", error.message);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// app.post("/api/human-data", async (req, res) => {
//   try {
//     console.log("📦 Incoming data from ESP32:", req.body);

//     // Forward data to target server
//     await axios.post(TARGET_URL, req.body, {
//       headers: { "Content-Type": "application/json" },
//       maxRedirects: 0, // IMPORTANT: prevent Axios from following redirects
//       validateStatus: status => status >= 200 && status < 400 // Accept 3xx as OK
//     });

//     console.log("✅ Data forwarded successfully!");
//     res.status(200).json({ message: "Data received by proxy ✅" }); // Always 200
//   } catch (error) {
//     console.error("❌ Error forwarding data:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });


// // Health check
// app.get("/", (req, res) => res.send("ESP32 HTTP Proxy is running 🚀"));

// const PORT = process.env.PORT || 8081;
// app.listen(PORT, () => console.log(`🚀 HTTP Proxy running on port ${PORT}`));


import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// ✅ Your Render backend URL
const TARGET_URL = "https://human-detection-y1pc.onrender.com/api/human-data";

// Health check
app.get("/", (req, res) => res.send("ESP32 HTTP Proxy running 🚀"));

// Proxy POST route
app.post("/api/human-data", async (req, res) => {
  try {
    console.log("📦 Incoming data from ESP32:", req.body);

    // ✅ Forward to actual Render server
    const response = await axios.post(TARGET_URL, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 5, // Allow following redirects
      timeout: 10000,  // Prevent hanging
    });

    console.log("✅ Data forwarded successfully! Render status:", response.status);

    // Always return 200 OK to SIM800L
    res.status(200).json({ message: "Data received and forwarded ✅" });

  } catch (error) {
    console.error("❌ Error forwarding data:", error.message);
    if (error.response) {
      console.error("Render response code:", error.response.status);
      console.error("Render response body:", error.response.data);
    }
    // Always respond 200 to SIM800L so it doesn't retry infinitely
    res.status(200).json({ message: "Proxy received data, but forwarding failed" });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`🚀 HTTP Proxy running on port ${PORT}`));
