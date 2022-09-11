/************** objet router definissant toutes les routes "product" **************/

const express = require("express");

const routerProduct = express.Router();


//import du fichier qui controle la logique des midellware concernant les requettes sur les produits
const productControler = require("../controlers/productCtrl");

//import du fichier qui controle la logique du midellware d'authenfication
const auth = require("../middelware/authentification/authentificationMiddl");

//import du fichier qui controle la logique du middelware d' enregistrement des images uploder par l' utilisateur (multer)
const multer = require("../middelware/storageFiles/storageImagesMiddl");





/****************** route "POST" ************************ */

// route pour creer un produit

routerProduct.post("/", auth.authCtrl, multer, productControler.createNewProduct);


/****************** route "PUT" ************************ */

// route pour modifier un produit

routerProduct.put("/:id", auth.authCtrl,  multer, productControler.updateOneProduct);



/****************** route "GET" ************************ */

// route pour recuperer toutes les produits
routerProduct.get("/", auth.authCtrl, productControler.getAllproduct); 


//route pour recuperer un seul produit en fonction de son ID
routerProduct.get("/:id", auth.authCtrl, productControler.getOneProduct );


/************ route delete ********************** */

//route pour supprimer un seul produit
routerProduct.delete("/:id", auth.authCtrl,  productControler.deleteOneProduct);


module.exports = routerProduct;
