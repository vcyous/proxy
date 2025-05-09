const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes (to handle OPTIONS requests)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://asri-webapps.vercel.app"],
    credentials: true,
  })
);

// Proxy API requests to the target backend server
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use(
  createProxyMiddleware({
    target: "http://16.78.69.22:8070", // Replace with your actual API URL
    changeOrigin: true,
    // secure: false,
    logger: console,
    // cookieDomainRewrite: "localhost",
    on: {
      proxyReq: (proxyReq, req, res) => {
        // Optional: handle CORS preflight request
        if (req.method === "OPTIONS") {
          res.writeHead(200, {
            // "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          });
          res.end();
        }

        // proxyReq.headers["Access-Control-Allow-Origin"] =
        //   "http://localhost:5713";
        // proxyReq.headers["Access-Control-Allow-Credentials"] = "true";
      },
      proxyRes: (proxyRes, req, res) => {
        // res.header("Access-Control-Allow-Origin", "http://localhost:5173");
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );
        // proxyRes.headers["Access-Control-Allow-Origin"] =
        //   "http://localhost:5713";
        // proxyRes.headers["Access-Control-Allow-Credentials"] = "true";
      },
      error: (err, req, res) => {
        /* handle error */
      },
    },
    // on: {
    //   proxyRes: (proxyRes, req, res) => {
    //     // proxyRes.headers["access-control-allow-origin"] = "localhost";
    //     res.setHeader("x-custom-header", "test");
    //     res.setHeader("Access-Control-Allow-Credentials", true);

    //     const cookies = proxyRes.headers["set-cookie"];
    //     if (cookies) {
    //       proxyRes.headers["set-cookie"] = cookies.map(
    //         (cookie) =>
    //           cookie
    //             .replace(/; secure/gi, "") // Remove 'Secure' if running on HTTP
    //             .replace(/; SameSite=None/gi, "; SameSite=Lax") // Optional: adjust SameSite if needed
    //       );
    //     }
    //   },
    // },
  })
);

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
