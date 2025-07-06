Multi-Factor Authentication System using Node.js and Google Authenticator

 Project Overview:
This project is a secure login system that integrates Multi-Factor Authentication (MFA) to provide an extra layer of protection beyond just a username and password. Built using Node.js and Express, it guides users through a smooth and simple authentication process using Google Authenticator.
After logging in with credentials and solving a CAPTCHA, users are prompted to enable MFA (if not already done). A unique QR code is generated, which they scan using the Google Authenticator app. Once verified with a time-based OTP, MFA is enabled for future logins, significantly increasing account security.

Key Features:
•	Username & Password Login
•	CAPTCHA verification to block automated login attempts
•	QR Code Generation for quick setup with Google Authenticator
•	OTP Verification using TOTP (Time-based One-Time Passwords)
•	Session-based authentication with full login/logout flow
•	Bootstrap 5 UI with responsive and clean form styling
•	Error handling for incorrect credentials, CAPTCHA, and OTPs
 Technologies Used:
•	Node.js + Express.js – Backend server and routing
•	EJS – View engine for rendering dynamic HTML templates
•	Bootstrap 5 – For consistent and responsive UI
•	svg-captcha – To generate CAPTCHA images
•	Speakeasy – For generating and verifying TOTP codes
•	qrcode – For generating QR codes for Google Authenticator
•	express-session – For handling user sessions

 Demo Credentials:
•	Username: test_user
•	Password: securepassword123
(These are hardcoded for demonstration purposes.)

 How It Works:
1.	User visits the login page and enters credentials + CAPTCHA
2.	If credentials are correct and MFA is not yet enabled:
o	The system generates a secret and QR code
o	User scans the QR with Google Authenticator
o	User enters the OTP to complete setup
3.	On future logins, user is prompted to enter the OTP after logging in
4.	If the OTP is valid, access is granted to the dashboard

 UI Highlights:
•	Modern, mobile-friendly interface with Bootstrap
•	Seamless QR and OTP integration
•	Simple, guided user experience
•	Fully responsive and accessible design

![welcome](https://github.com/user-attachments/assets/33592a7b-1d77-4ebd-875b-2e9fb2004e24)
![QR CODE](https://github.com/user-attachments/assets/8d56ba4d-2677-4af5-9a7b-7354e092a7ed)
![login](https://github.com/user-attachments/assets/54936769-a3af-46c5-b427-d7bb0cc3d629)



