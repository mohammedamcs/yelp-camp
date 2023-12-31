// Model
const User = require("../models/user");

// Show register form
module.exports.renderRegisterForm = async (req, res) => {
  res.render("users/register");
};

// Create a new user
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To Campgrounds");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

// Show login form
module.exports.renderLoginForm = async (req, res) => {
  res.render("users/login");
};

// Login
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome Back ${req.user.username}`);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirectUrl);
};

// Logout
module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
