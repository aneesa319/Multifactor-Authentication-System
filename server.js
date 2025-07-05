// server.js

const express = require("express");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (for demo only)
let temp_secret;

// Route 1: Home
app.get("/", (req, res) => {
  res.send(`
    <h2>Welcome to MFA Server</h2>
    <p>Go to <a href="/generate">/generate</a> to start MFA setup.</p>
  `);
});

// Route 2: Generate MFA Secret + QR Code
app.get("/generate", (req, res) => {
  const secret = speakeasy.generateSecret({ name: "MyApp (demo)" });
  temp_secret = secret; // Store it temporarily

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) return res.send("Error generating QR code.");

    res.send(`
      <h3>Scan this QR code with Google Authenticator:</h3>
      <img src="${data_url}" />
      <p>Or manually enter this secret: <strong>${secret.base32}</strong></p>
      <form action="/verify" method="POST">
        <input type="text" name="token" placeholder="Enter 6-digit code" required />
        <button type="submit">Verify</button>
      </form>
    `);
  });
});

// Route 3: Verify the entered 2FA code
app.post("/verify", (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: temp_secret.base32,
    encoding: "base32",
    token: token,
    window: 1, // allow +/-1 step for time drift
  });

  if (verified) {
    res.send("<h2>✅ Code verified! MFA setup complete.</h2>");
  } else {
    res.send("<h2>❌ Invalid code. Please try again.</h2>");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
