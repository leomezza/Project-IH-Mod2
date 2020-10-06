const express = require('express');

const router = express.Router();

const User = require('../models/User.model');
const { generateEncryptedPassword } = require('../utils/passwordManager');

const verifyData = require('../middlewares/verifyData');
const verifyLoginData = require('../middlewares/verifyLoginData');
const verifyForgotData = require('../middlewares/verifyForgotData');
const redirectIfLoggedIn = require('../middlewares/redirectIfLoggedIn');

/* GET home page */
// router.get('/', redirectIfLoggedIn, (req, res, next) => {
//   res.render('auth-views/index.hbs');
// });

router.get('/', (req, res) => {
  console.log('Login page');
  res.render('auth-views/index.hbs', req.query);
});

router.post('/', verifyLoginData, async (req, res) => {
  try {
    const userAuthCopy = JSON.parse(JSON.stringify(req.userAuthenticated));

    delete userAuthCopy.password;

    req.session.currentUser = userAuthCopy;

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});


router.get('/signup', (req, res) => {
  console.log('Sign-up page')
  res.render('auth-views/signup.hbs');
});

router.post('/signup', verifyData, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      phone,
      secretQuestion,
      secretAnswer,
      password,
    } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      username,
      phone,
      secretQuestion,
      secretAnswer,
      password: await generateEncryptedPassword(password),
    });

    await newUser.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

router.get('/forgotpass', (req, res) => {
  console.log('Forgot Password page');
  res.render('auth-views/forgotpass.hbs');
});

router.post('/forgotpass', verifyForgotData, async (req, res) => {
  try {
    const { password } = req.body;

    const newPassword = new Password({
      password: await generateEncryptedPassword(password),
    });

    await newPassword.save();

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});

module.exports = router;
