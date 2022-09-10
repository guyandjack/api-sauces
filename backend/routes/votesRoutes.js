// import du module express
const express = require("express");

//creation d' un router
const voteRouter = express.Router();


// importation des fichier contenant le middeware d' authentification
const auth = require("../middelware/authentification/authentificationMiddl");

//importation du fichier contenant les controleurs
const voteControler = require("../controlers/voteCtrl");



// route pour noter un produit
voteRouter.post("/:id/like",  auth.authCtrl, voteControler.likeOrDislike);


module.exports = voteRouter;