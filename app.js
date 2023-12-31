if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const AppError = require("./helpers/AppError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const contentSecurityPolicyConfig = require("./config/contentSecurityPolicy");
const sessionConfig = require("./config/session");
const setLocals = require("./middlewares/locals");
const errorHandler = require("./middlewares/error");


// connection to mongodb
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/campground";
mongoose
  .connect(dbUrl)
  .then(() => console.log("connection to db is on..."))
  .catch((err) => console.log(err));

// creates an express app
const app = express();
const port = process.env.PORT || 5000;

// use ejs-locals for all ejs templates:
app.engine("ejs", ejsMate);

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for static files
app.use(express.static(path.join(__dirname, "public")));

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("_method"));

// To sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(mongoSanitize());

// Session
app.use(session(sessionConfig));

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash messages
app.use(flash());
// for setting locals
app.use(setLocals());

// helmet
app.use(helmet({ crossOriginEmbedderPolicy: { policy: "credentialless" } }));
app.use(helmet.contentSecurityPolicy(contentSecurityPolicyConfig));

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Users Routes
app.use("/", userRoutes);

// Campgrounds Routes
app.use("/campgrounds", campgroundRoutes);

// Review Routes
app.use("/campgrounds/:campground_id/reviews", reviewRoutes);

// 404
app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

// Error Handler Middleware
app.use(errorHandler());

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
