const MongoStore = require("connect-mongo");
const dbUrl =  process.env.DB_URL || "mongodb://localhost:27017/campground";
const store = MongoStore.create({ mongoUrl: dbUrl,secret:"thisIsOurSecretOoosh...",touchAfter: 24 * 3600 })
store.on('error',function(e){
  console.log(e)
})

const secret = process.env.SECRET_SESSION || "thisIsOurSecretOoosh...";
module.exports = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date().now + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
