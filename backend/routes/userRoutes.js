/************** objet router definissant toutes les routes "user" **************/

const express = require("express");

const routerUser = express.Router();


//import du fichier qui controle la logique des midellware concernant les requettes sur l' utilisateur
const userControler = require("../controlers/userCtrl");

/****************** route "POST" ************************ */

// route pour creer un nouvel utilisateur

routerUser.post("/signup", userControler.createNewUser );

//route login utilisateur

routerUser.post("/login", userControler.loginUser);

module.exports = routerUser;
