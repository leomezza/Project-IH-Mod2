const User = require('../models/User.model');
const { verifyPassword } = require('../utils/passwordManager');

const verifyLoginData = async (req, res, next) => {
  const { username, password } = req.body;

  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!(username.match(mailformat))) {
    const errors = {
      usernameError: 'Invalid e-mail format',
    };

    res.render('auth-views/index', errors);

    return;
  }

  const userExists = await User.findOne({ username });

  if (!userExists) {
    res.render('auth-views/index', { errorMessage: 'Incorrect username or password, please try again' });

    return;
  }

  if (password.length < 6) {
    const errors = {
      passwordError: password.length < 6 ? 'Password must contain at least 6 characters' : undefined,
    };

    res.render('auth-views/index', errors);

    return;
  }

  const isPasswordMatch = verifyPassword(password, userExists.password);

  if (!isPasswordMatch) {
    res.render('auth-views/index', { errorMessage: 'Incorrect username or password, please try again' });

    return;
  }
  req.userAuthenticated = userExists;
  next();
};

module.exports = verifyLoginData;
