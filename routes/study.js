const express = require("express");
const router = express.Router();
const db = require('../db.js');
const authenticate = require('../middlewares/auth.js');

// total minutes
router.get('/total', authenticate, async (req,res) => {
  const uuid = req.user.id;
  let results;
  try {
    results = await db.query("SELECT SUM(minutes) FROM study_sessions WHERE user_id=$1", [uuid]);
  } catch (err) {
    res.status(400).json({
      message: "ERROR ON SERVER!"
    });
    return;
  }
  const total = results.rows[0].sum;
  if (!total) {
    res.status(200).json({
      message: "No study sessions found",
      total: 0
      
    });
    return;
  }
  res.status(200).json({
    message: "Study sessions total found!",
    total: total
  });
});

// get history
router.get('/history', authenticate, async (req,res) => {
  const uuid = req.user.id;
  let results;
  try {
  results = await db.query("SELECT * FROM study_sessions WHERE user_id=$1", [uuid]);
  } catch (err) {
    res.status(400).json({
      message: 'error on server!'
    });
    return;
  }
  if (!results || results.rows.length === 0) {
    res.status(200).json({
      message: 'No study sessions found'
    });
    return;
  }
  res.status(200).json({
    message: 'Study sessions found!',
    results: results.rows});
  return;

});
router.get('/user', authenticate, async (req, res) =>{
  const uuid = req.user.id;
  try {
    results = await db.query('SELECT * FROM study_sessions WHERE user_id=$1', [uuid]);

  } catch (err) {
    res.status(400).json(
      {
        message: "An error occured"
      }
    );
    return;
  }
  res.status(200).json({
    message: "Success!",
    user: results.rows
  });
});
// add new study session to user justn eed to put minutes
router.post('/add', authenticate, async (req, res) => {
  const uuid = req.user.id;
  const minutes = req.body.minutes;

  try {
    await db.query('INSERT INTO study_sessions (user_id, minutes) VALUES ($1, $2)', [uuid, minutes]);

    res.json({
      message: 'Successfully added study session'
    })
  } catch (err) {
    res.status(400).json({
      message: "An error occured"
    });
  }

});

router.get('/top-today', authenticate, async (req, res) => {
  let results;
  try {
    results = await db.query(` SELECT u.display_name, SUM(s.minutes) AS total_minutes
      FROM study_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.created_at >= NOW() - INTERVAL '1 day'
      GROUP BY u.display_name
      ORDER BY total_minutes DESC
      LIMIT 10`);
    } catch (err) {
      res.status(400).json({
        message: "SERVER ERROR"
      });
      return;
    }
    if (!results || results.rows.length == 0) {
      res.status(400).json({
        message: "SERVER ERROR 2"
      });
      return;
    }
    res.status(200).json({
      message: "Top Study in the past 24 hours",
      top: results.rows
    });
  
  });
module.exports = router;