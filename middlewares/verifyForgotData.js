const User = require('../models/User.model');

const verifyForgotData = async (req, res, next) => {
  const { username, phone, secretQuestion, secretAnswer, 
    password, confirmationPassword } = req.body;

  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!(username.match(mailformat))) {
    const errors = {
      usernameError: 'Invalid e-mail format',
    };

    res.render('auth-views/forgotpass', errors);

    return;
  }

  const userExists = await User.findOne({ username });

  if (!userExists) {
    res.render('auth-views/forgotpass', { errorMessage: 'Incorrect username, please try again' });

    return;
  }

  if (!(userExists.secretQuestion === secretQuestion) || 
  !(userExists.secretAnswer === secretAnswer) ||
  !(userExists.phone === +phone)) {
    res.render('auth-views/forgotpass', { errorMessage: 'Invalid information, please try again' });

    return;
  }

  if (password.length < 6) {
    const errors = {
      passwordError: password.length < 6 ? 'Password must contain at least 6 characters' : undefined,
    };

    res.render('auth-views/forgotpass', errors);

    return;
  }

  if (!(password === confirmationPassword)) {
    const errors = {
      passwordError: 'Password does not match',
      confirmationPasswordError: 'Password does not match',
    };

    res.render('auth-views/forgotpass', errors);

    return;
  }

  next();
};

module.exports = verifyForgotData;
