const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const dotenv = require('dotenv').config();

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // or bodyParser.urlencoded({ extended: true })

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
