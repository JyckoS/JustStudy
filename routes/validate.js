const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth.js');

router.get("/validate-token", authenticate, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;