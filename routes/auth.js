const express = require('express');
const router = express.Router();
const db = require('../db.js');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Setup router here

/**
 * Register Post
 */
router.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const display = req.body.display;
  const hashedPassword = await bcryptjs.hash(password, 10);
  try {
    await db.query('INSERT INTO users (email, password, display_name) VALUES ($1, $2, $3)', [email, hashedPassword, display]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique violation code
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});
/**
 * Generate token from JWT_SECRET
 * @param {*} userId 
 * @param {*} email 
 */
function generateToken(userId, email) {
  const token = jwt.sign({
    id: userId,
    email: email
  }, JWT_SECRET, { expiresIn: '7d' });
  return token;
}

/**
 * Login Post
 */
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  // User not found
  if (result.rows.length === 0) {
    res.status(400).json({
      message: 'Email not found'
    })
  } else {
    const dbPassword = result.rows[0].password;
    const dbUserId = result.rows[0].id;
    const success = await bcryptjs.compare(password, dbPassword);
    if (success) {

      res.status(200).json({
        message: 'Login success!',
        token: generateToken(dbUserId, email),
        uuid: dbUserId
      });
    } else {
      res.status(400).json({
        message: 'Wrong password'
      });
    }
  }
});

module.exports = router;
