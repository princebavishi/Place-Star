const express = require("express");
const connection = require("../db.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const vverifyToken = require("./../middlewares/middleware.js");
const moment = require("moment");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require("dotenv").config();

const router = express.Router();

const secret = process.env.JWT_SECRET || "yourSecretKey";

const { verifyToken, checkRole } = vverifyToken;

router.use(express.json());
router.use(cookieParser());

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id", connection.threadId);
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
  }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Error sending email' };
  }
};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
  }


  router.post('/register_user', (req, res) => {
    const { firstname, middlename, lastname,email, department, classname: studentClass,semester, batch, username,password  } = req.body;
 
    // Check if all fields are provided
    if (!firstname || !middlename || !lastname || !department || !semester || !batch || !email || !username || !password || !studentClass) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if the password length is greater than 8
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be greater than 8 characters' });
    }
  
    // Generate a 6-digit OTP
    const otp = generateOTP();
  
    // Placeholder values for status and account status
    const status = 'Active';
    const accountStatus = 'Not Verified';
  
    // Query database to check if the user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE Email = ? OR Username = ?';
  
    connection.query(checkUserQuery, [email, username], (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (checkResults.length > 0) {
        const existingUser = checkResults[0];
        if (existingUser.AccountStatus === 'Verified') {
          return res.status(409).json({ message: 'User already exists and is verified' });
        } else {
          return res.status(409).json({ message: 'User already exists but is not verified' });
        }
      }
  
      // Define the query for inserting a new user
      const insertUserQuery = 'INSERT INTO users (FirstName, MiddleName, LastName, Email, Username, Password, Role, sem, class, batch, OTP, Status, AccountStatus) VALUES (?, ?, ?, ?, ?, ?, "Student", ?, ?, ?, ?, ?, ?)';

      // Insert the new user into the database
      connection.query(insertUserQuery, [firstname, middlename, lastname, email, username, password, semester, studentClass, batch, otp, status, accountStatus], async (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ message: 'Internal Server Error' });
        } else {
          // Send email after successfully inserting the user
          const emailSubject = 'Welcome to Our PlaceStar : DEPSTAR Quiz Portal';
          const emailText = `Dear ${firstname},\n\nYour OTP is ${otp}.Thank you for registering.\n\nBest regards,\nPlacestar Charusat`;
  
          const emailResult = await sendEmail(email, emailSubject, emailText);
  
          if (emailResult.success) {
            res.status(200).json({ message: 'Student added successfully and email sent' });
          } else {
            res.status(200).json({ message: 'Student added successfully but failed to send email' });
          }
        }
      });
    });
  });
  
//   router.post("/register_user", (req, res) => {
//     const { firstname, middlename, lastname, department, semester, batch, email, username, password, class: studentClass , subject, text } = req.body;
  
//     // Check if all fields are provided
//     if (!firstname || !middlename || !lastname || !department || !semester || !batch || !email || !username || !password || !studentClass) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
  
//     // Check if the password length is greater than 8
//     if (password.length <= 8) {
//         return res.status(400).json({ message: "Password must be greater than 8 characters" });
//     }
  
//     // Generate a 6-digit OTP
//     const otp = generateOTP();
  
//     // Placeholder values for status and account status
//     const status = "Active";
//     const accountStatus = "Not Verified";
  
//     // Query database to check if the user already exists
//     const checkUserQuery = "SELECT * FROM users WHERE Email = ? OR Username = ?";
  
//     connection.query(checkUserQuery, [email, username], (checkError, checkResults) => {
//         if (checkError) {
//             console.error(checkError);
//             return res.status(500).json({ message: "Internal Server Error" });
//         }
  
//         if (checkResults.length > 0) {
//             const existingUser = checkResults[0];
//             if (existingUser.AccountStatus === "Verified") {
//                 return res.status(409).json({ message: "User already exists and is verified" });
//             } else {
//                 return res.status(409).json({ message: "User already exists but is not verified" });
//             }
//         }
  
//         // Define the query for inserting a new user
//         const insertUserQuery = "INSERT INTO users (FirstName, MiddleName, LastName, Email, Username, Password, Role, sem, class, batch, OTP, Status, AccountStatus) VALUES (?, ?, ?, ?, ?, ?, 'Student', ?, ?, ?, ?, ?, ?)";
  
//         // Insert the new user into the database
//         connection.query(insertUserQuery, [firstname, middlename, lastname, email, username, password, semester, studentClass, batch, otp, status, accountStatus], (insertError, insertResults) => {
//             if (insertError) {
//                 console.error(insertError);
//                 return res.status(500).json({ message: "Internal Server Error" });
//             } else {
//                 res.json({ message: "Student added successfully" });
//             }
//         });
//     });
// });



  router.post('/verifyOTP', (req, res) => {
    const { email:gmail, OTP:user_otp } = req.body;
    
    if (!gmail || !user_otp) {
      return res.status(400).json({ error: 'Gmail and OTP are required.' });
    }
  
    // Query the database to find the OTP based on the provided Gmail
    connection.query('SELECT OTP FROM users WHERE Email = ?', [gmail], (err, results) => {
      if (err) {
        console.error('Error executing query:', err.stack);
        return res.status(500).json({ error: 'Database query error.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Retrieve the OTP from the database
      const db_otp = results[0].OTP;
  
      // Compare the OTPs using string conversion to avoid type mismatches
      if (String(db_otp) === String(user_otp)) {
        // OTPs match, update the AccountStatus to "Verified"
        connection.query('UPDATE users SET AccountStatus = "Verified" WHERE Email = ?', [gmail], (updateErr) => {
          if (updateErr) {
            console.error('Error updating account status:', updateErr.stack);
            return res.status(500).json({ error: 'Error updating account status.' });
          }
  
          // Success response
          res.json({ message: 'Account verified successfully.' });
        });
      } else {
        // OTPs do not match
        res.status(401).json({ error: 'Invalid OTP.' });
      }
    });
  });

  router.post('/register_faculty', (req, res) => {
    const { firstname, middlename, lastname, email, department, username, password } = req.body;
 
    if (!firstname || !middlename || !lastname || !department || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be greater than 8 characters' });
    }
  
    const otp = generateOTP();
    const status = 'Active';
    const accountStatus = 'Not Verified';
  
    const checkUserQuery = 'SELECT * FROM users WHERE Email = ? OR Username = ?';
  
    connection.query(checkUserQuery, [email, username], (checkError, checkResults) => {
      if (checkError) {
        console.error(checkError);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
  
      if (checkResults.length > 0) {
        const existingUser = checkResults[0];
        if (existingUser.AccountStatus === 'Verified') {
          return res.status(409).json({ message: 'User already exists and is verified' });
        } else {
          return res.status(409).json({ message: 'User already exists but is not verified' });
        }
      }
  
      const insertUserQuery = 'INSERT INTO users (FirstName, MiddleName, LastName, Email, Username, Password, Role, sem, class, batch, OTP, Status, AccountStatus) VALUES (?, ?, ?, ?, ?, ?, "Faculty", "all", ?, "all", ?, ?, ?)';
 
      connection.query(insertUserQuery, [firstname, middlename, lastname, email, username, password, department, otp, status, accountStatus], async (insertError, insertResults) => {
        if (insertError) {
          console.error(insertError);
          return res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const emailSubject = 'Welcome to Our PlaceStar : DEPSTAR Quiz Portal';
          const emailText = `Dear ${firstname},\n\nYour OTP is ${otp}.Thank you for registering.\n\nBest regards,\nPlacestar Charusat`;
  
          const emailResult = await sendEmail(email, emailSubject, emailText);
  
          if (emailResult.success) {
            res.status(200).json({ message: 'Faculty added successfully and email sent' });
          } else {
            res.status(200).json({ message: 'Faculty added successfully but failed to send email' });
          }
        }
      });
    });
  });
  
  
  
  
module.exports = router;
