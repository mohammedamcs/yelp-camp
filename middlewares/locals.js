// Setting locals
module.exports = function () {
  return (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.returnTo = req.session.returnTo;
    next();
  };
};
