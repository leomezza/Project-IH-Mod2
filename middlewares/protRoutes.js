const protRoutes = (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/?sessionExpired=true');
    return;
  }

  next();
};

module.exports = protRoutes;
