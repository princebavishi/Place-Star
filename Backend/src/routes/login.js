// Import required modules
const express = require('express');
const pool = require('../db.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Create express app
const app = express();
const router = express.Router();

app.use(cookieParser());

// Middleware to parse JSON bodies
router.use(express.json());

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query database to find user
    pool.query('SELECT * FROM users WHERE Username = ?', [username], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];

        // Check if account status is verified
        if (user.AccountStatus !== 'Verified') {
            return res.status(403).json({ message: 'Account not verified. Please verify your account before logging in.' });
        }

        // Compare provided password with stored password (not using bcrypt)
        if (password !== user.Password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const userId = user.UserID;
        const role = user.Role;
        const sem = user.sem;
        const classs = user.class;
        const batch = user.batch;

        let dashboard;
        if (role === "Admin") {
            dashboard = "Admin";
        } else if (role === "Faculty") {
            dashboard = "Faculty";
        } else {
            dashboard = "Student";
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { username: username, role: role, userID: userId, sem: sem, classs: classs, batch: batch },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.json({
            role: dashboard,
            token: accessToken,
            status: "User logged in successfully"
        });
    });
});


module.exports = router;
