const mongoose = require("mongoose");

// const ObjectId = _Schema.Types.ObjectId;
const Schema = mongoose.Schema 

// Database schema for saving users and their information
let userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
})

module.exports = mongoose.model("User", userSchema)