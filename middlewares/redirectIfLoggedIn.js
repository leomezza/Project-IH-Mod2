const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/dashboard');
    return;
  }

  next();
};

module.exports = redirectIfLoggedIn;
