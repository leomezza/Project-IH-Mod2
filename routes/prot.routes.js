const express = require('express');
const router = express.Router();

// const protRoutes = require('../middlewares/protRoutes');

// router.use(protRoutes);

router.get('/dashboard', (req, res) => {
  console.log('Dashboard page');
  res.render('dashboard');
});

module.exports = router;
