const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes (to handle OPTIONS requests)
app.use(cors());

// Middleware to handle OPTIONS requests manually
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log("Intercepted OPTIONS request");
    res.header("Access-Control-Allow-Origin", "*"); // Adjust as needed
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Add custom headers if needed
    res.header("Custom-Response-Header", "MyCustomResponseValue");

    return res.status(200).end();
  }
  next();
});

// Proxy API requests to the target backend server
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://16.78.69.22:8069/jsonrpc", // Replace with your actual API URL
    changeOrigin: true,
    onProxyRes(proxyRes, req, res) {
      // Modify response headers for OPTIONS requests
      if (req.method === "OPTIONS") {
        proxyRes.headers["Custom-Response-Header"] = "MyCustomResponseValue";
      }
    },
  })
);

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
