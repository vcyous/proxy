const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes (to handle OPTIONS requests)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://16.78.182.248",
      "http://16.78.69.22",
      "https://asri-webapps.vercel.app",
    ],
    credentials: true,
  })
);

// Proxy API requests to the target backend server
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use(
  "/webservice",
  createProxyMiddleware({
    target: "http://16.78.182.248:8080",
    changeOrigin: true,
    logger: console,
    pathRewrite: {
      "^/webservice": "",
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.method === "OPTIONS") {
          res.writeHead(200, {
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, credential_token",
          });
          res.end();
        }
      },
      proxyRes: (proxyRes, req, res) => {
        const cookies = proxyRes.headers["set-cookie"];
        if (cookies) {
          const modifiedCookies = cookies.map((cookie) => {
            let newCookie = cookie.replace(/; ?SameSite=[^;]+/i, "");
            if (!/; ?Secure/i.test(newCookie)) {
              newCookie += "; Secure";
            }
            newCookie += "; SameSite=None";

            return newCookie;
          });

          proxyRes.headers["set-cookie"] = modifiedCookies;
        }
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization, credential_token"
        );
      },
      error: (err, req, res) => {
        /* handle error */
      },
    },
  })
);

app.use(
  "/odoo",
  createProxyMiddleware({
    target: "http://16.78.69.22:8070",
    changeOrigin: true,
    logger: console,
    pathRewrite: {
      "^/odoo": "",
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        if (req.method === "OPTIONS") {
          res.writeHead(200, {
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          });
          res.end();
        }
      },
      proxyRes: (proxyRes, req, res) => {
        const cookies = proxyRes.headers["set-cookie"];
        if (cookies) {
          const modifiedCookies = cookies.map((cookie) => {
            let newCookie = cookie.replace(/; ?SameSite=[^;]+/i, "");

            if (!/; ?Secure/i.test(newCookie)) {
              newCookie += "; Secure";
            }
            newCookie += "; SameSite=None";

            return newCookie;
          });

          proxyRes.headers["set-cookie"] = modifiedCookies;
        }
        res.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization"
        );
      },
      error: (err, req, res) => {
        /* handle error */
      },
    },
  })
);

// Start the proxy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
