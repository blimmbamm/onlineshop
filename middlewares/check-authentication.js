const checkLoginStatus = async (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.locals.isAuthenticated = true;
  }

  next();
};

module.exports = checkLoginStatus;
