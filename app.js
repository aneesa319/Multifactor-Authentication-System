const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const svgCaptcha = require('svg-captcha');
const path = require('path');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();

// In-memory user store
const users = {
  'test_user': {
    password: 'securepassword123',
    mfaEnabled: false,
    mfaSecret: ''
  }
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// GET /login
app.get('/login', (req, res) => {
  const captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.render('login', { captcha: captcha.data });
});

// POST /login
app.post('/login', (req, res) => {
  const { username, password, captcha } = req.body;

  if (captcha !== req.session.captcha) {
    return res.send('Captcha does not match!');
  }

  const user = users[username];
  if (!user || user.password !== password) {
    return res.send('Invalid credentials!');
  }

  req.session.username = username;

  if (!user.mfaEnabled) {
    const secret = speakeasy.generateSecret({ name: "MyApp (demo)" });
    user.mfaSecret = secret.base32;
    req.session.tempSecret = secret.base32;

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.send("Error generating QR code");

      return res.render('enable_mfa', {
        qr: data_url,
        secret: secret.base32,
        error: null
      });
    });
  } else {
    req.session.mfaSecret = user.mfaSecret;
    return res.redirect('/mfa_verify');
  }
});

// POST /enable_mfa
app.post('/enable_mfa', (req, res) => {
  const username = req.session.username;
  const { otp } = req.body;

  if (!username || !req.session.tempSecret) return res.redirect('/login');

  const verified = speakeasy.totp.verify({
    secret: req.session.tempSecret,
    encoding: 'base32',
    token: otp,
    window: 2
  });

  if (verified) {
    users[username].mfaEnabled = true;
    users[username].mfaSecret = req.session.tempSecret;
    req.session.mfaSecret = req.session.tempSecret;
    delete req.session.tempSecret;
    return res.redirect('/');
  } else {
    const secret = req.session.tempSecret;
    const otpauthUrl = speakeasy.otpauthURL({ secret, label: username, encoding: 'base32' });

    qrcode.toDataURL(otpauthUrl, (err, data_url) => {
      if (err) return res.send("Error generating QR again");

      return res.render('enable_mfa', {
        qr: data_url,
        secret: secret,
        error: '❌ Invalid OTP! Try again.'
      });
    });
  }
});

// GET /mfa_verify (Only used when already MFA-enabled)
app.get('/mfa_verify', (req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.render('mfa_verify');
});

// POST /mfa_verify
app.post('/mfa_verify', (req, res) => {
  const { otp } = req.body;
  const secret = req.session.mfaSecret;

  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: otp,
    window: 2
  });

  if (verified) {
    return res.redirect('/');
  } else {
    return res.send('❌ Invalid OTP!');
  }
});

// GET /
app.get('/', (req, res) => {
  if (!req.session.username) return res.redirect('/login');
  res.render('home', { username: req.session.username });
});

// Start server
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
// ✅ GET /login_qr — Login using QR code (skip password)
app.get('/login_qr', (req, res) => {
  const username = 'test_user'; // You can later make this dynamic
  const user = users[username];

  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    return res.send("MFA not set up yet for this user.");
  }

  req.session.username = username;
  req.session.mfaSecret = user.mfaSecret;

  return res.redirect('/mfa_verify');
});
