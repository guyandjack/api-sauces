/****** creation d' un model produit pour MongoDB *********/ 

//import du package Mongoose
const mongoose = require("mongoose");




const productSchema = mongoose.Schema({

    userId : { type : String, required : false },
    name : { type : String, required : false},
    manufactureur : { type : String, required : false},
    description : { type : String, required : false},
    mainPepper : { type : String, required : false},
    imageUrl : { type : String, required : false},
    heat : { type : Number, required : false},
    likes : { type : Number, required : false},
    dislikes : { type : Number, required : false},
    usersLiked : { type : Array, required : false},
    usersDisliked : { type : Array, required : false}
});



module.exports = mongoose.model("product", productSchema);
