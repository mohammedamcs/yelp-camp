const mongoose = require("mongoose");
const { Schema } = mongoose;
const passprotLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passprotLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
