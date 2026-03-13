console.log('Starting server...');
// Import Modules
const express = require('express');
const cors = require('cors');
const db = require('./db.js');

// Setup Express
const app = express();
app.use(cors());
app.use(express.json());

// Setup Auth
const auth = require('./routes/auth.js');
app.use('/auth', auth);

// Setup Validate
const validate = require('./routes/validate.js');
app.use('/auth', validate);

// Setup Study
const study = require('./routes/study.js');
app.use('/study', study);


// Healthy response
app.get('/', (req, res) =>
{
  res.json({
    message: 'Success! Welcome to JustStudy'
  });
});

// Setup port and start listening

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server listening to port " + PORT));