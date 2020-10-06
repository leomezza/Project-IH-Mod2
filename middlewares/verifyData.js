const User = require('../models/User.model');

const verifyData = async (req, res, next) => {
  const { username, password, confirmationPassword } = req.body;

  const usernameExists = await User.find({ username });

  if (usernameExists.length > 0) {
    const errors = {
      usernameError: usernameExists.length > 0 ? 'Username already exists' : undefined,
    };

    res.render('auth-views/signup', errors);

    return;
  }

  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!(username.match(mailformat))) {
    const errors = {
      usernameError: 'Invalid e-mail format',
    };

    res.render('auth-views/signup', errors);

    return;
  }

  if (password.length < 6) {
    const errors = {
      passwordError: password.length < 6 ? 'Password must contain at least 6 characters' : undefined,
    };

    res.render('auth-views/signup.hbs', errors);

    return;
  }

  if (!(password === confirmationPassword)) {
    const errors = {
      passwordError: 'Password does not match',
      confirmationPasswordError: 'Password does not match',
    };

    res.render('auth-views/signup.hbs', errors);

    return;
  }

  next();
};

module.exports = verifyData;
