/****** creation d' un model utilisateur pour MongoDB *********/

//import du package Mongoose
const mongoose = require("mongoose");

//import du module unique validator
const uniqueValidator = require("mongoose-unique-validator");


const userSchema = mongoose.Schema({
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true}
});

uniqueValidator(userSchema);

module.exports = mongoose.model("User", userSchema);