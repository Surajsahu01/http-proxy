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

// Your actual Render server
const TARGET_URL = "https://human-detection-y1pc.onrender.com/api/human-data";

// Health check
app.get("/", (req, res) => res.send("ESP32 HTTP Proxy is running 🚀"));

// Proxy POST route
app.post("/api/human-data", async (req, res) => {
  try {
    console.log("📦 Incoming data from ESP32:", req.body);

    // Forward data to actual server
    await axios.post(TARGET_URL, req.body, {
      headers: { "Content-Type": "application/json" },
      maxRedirects: 0,             // Don't follow redirects
      validateStatus: status => status >= 200 && status < 400
    });

    // Always respond with 200 OK and a small JSON body
    res.status(200).json({ message: "Data received by proxy ✅" });
    console.log("✅ Data forwarded successfully!");

  } catch (error) {
    console.error("❌ Error forwarding data:", error.message);

    // Always return 200 OK to SIM800L to avoid retries for proxy issues
    res.status(200).json({ message: "Proxy error, but SIM800L notified ✅" });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`🚀 HTTP Proxy running on port ${PORT}`));
