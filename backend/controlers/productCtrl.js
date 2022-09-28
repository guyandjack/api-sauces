/***** gere la logique des midellware (requettes) concernant les produits *****************/

//import des models Mongo "product" et "user"
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

//import du module fs pour la manipulation de fichiers
const fs = require("fs");
const { throwError } = require("rxjs");



/****************************************  permet de créer un nouveau produit  ********************/

exports.createNewProduct = (req, res, next) => {

  const productObject = JSON.parse(req.body.sauce);

  // (SECURITE AUTHENTIFICATION) si la propriete "authentification" issu du midellware d' authentification n' existe pas on interdit l' affichage de toutes les sauces.


     if ( typeof req.authentification == "undefined" ) {
        
        res.status(403).json({ message: "erreur 403 : Acces denied because..." });
      }


    delete productObject.userId;
    
          const newProduct = new productModel({
            ...productObject,
            userId: req.authentification.userId, // (SECURITE AUTHENTIFICATION) on utilise l' userId issu du token pour attribuer le produit à l' utilisateur
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            
          });

          newProduct.save()
            .then( () => { res.status(201).json({ message : "produit enregistré"})})
            .catch( (error) => { res.status(400).json({ error })});
        
};



/****************************************  permet de modifier un produit*********************/ 

exports.updateOneProduct = ( req, res, next) => {

  // récuperation des donneés dans les parametres de la requette
  const sauceId = req.params.id;

  // teste du type de la requette

  // cas où le format de la requette est un "string" car elle contient fichier
    if(typeof req.body.sauce === "string"){

      
      //const objectRequest = JSON.parse(req.authentification)
      const productModified = JSON.parse(req.body.sauce);
      
      // (SECURITE AUTHENTIFICATION) si l' iduser de la sauce est different que l' id user issu du token on interdit la modification

     if ( typeof req.authentification == "undefined" ||  productModified.userId != req.authentification.userId) {

        res.status(403).json({ message: "erreur 403 : Acces denied because......" });
     }

      
      // creation du chemin ou sera enregistrer la nouvelle image
      const newImageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        
      productModel.findById({ _id : sauceId })

          .then( (productToModify) => {

            const urlProduct = productToModify.imageUrl.split("/images/");
            const pathFile = urlProduct[1];
            const fullPathFile = "images/" + pathFile;

            // suppression de l' image correspondante au produit
            fs.unlink(fullPathFile, (error) => {
              if (error) {
                throw error;
              }
            });

            productToModify
              .update({
                ...productModified,
                imageUrl: newImageUrl,
              })

              .then( () => {
                res.status(201).json({ message: " Sauce mise à jour " })})

              .catch((e) => {
                res.status(500).json({ message: " Erreur 500 : Sauce non actualisée " + e });
              });


            
          })

              
          .catch( (e) => { res.status(500).json({ message : " Erreur 500 : " + e })});
      

          
    }

    // cas où le format de la requette est un simple json sans fichier
    else{

      const productModified = req.body;
      
      // (SECURITE AUTHENTIFICATION) si l' iduser de la sauce est different que l' id user issu du token on interdit la modification

      if ( typeof req.authentification == "undefined"  || productModified.userId != req.authentification.userId) {
        
        res.status(403).json({ message: "erreur 403 : Acces denied because.????" });
      }

      productModel
        .updateOne(
          { _id: sauceId },
          {
            ...productModified,
            
          }
        )
        .then( () => { res.status(201).json({ message: "Sauce mise à jours" })})
            
        .catch((e) => { res.status(500).json({ message: " Erreur 500 : Sauce non actualisée " + e })}); 
       
           
    }
    
}; 






/**************************** Permet de recuperer tous les produits ****************************/

exports.getAllproduct = (req, res, next) => {

  
  // (SECURITE AUTHENTIFICATION) si la propriete "authentification" issu du midellware d' authentification n' existe pas on interdit l' affichage de toutes les sauces.

   
  if (typeof req.authentification == "undefined" ) {
    res.status(403).json({ message: "erreur 403 : Acces denied because!." });
  }

  // (SECURITE AUTHENTIFICATION) si l' id de l' utilisateur correspond à un userId enregistré dans la BDD on autorise l' affichage de toute les sauces

  userModel.findById( { _id : req.authentification.userId })

    .then(() => {

      productModel.find()

        .then((allProducts) => {
          res.status(200).json(allProducts);
        })
        .catch((e) => {
          res.status(500).json({ message: "Erreur 500 " + e });
        });
    })

    .catch((e) => {res.status(500).json({ message:  e });})

 
};






/********************** permet de recuperer un  seul produit **********************************/

exports.getOneProduct = (req, res, next) => {
  // (SECURITE AUTHENTIFICATION) si la propriete "authentification" issu du midellware d' authentification n' existe pas on interdit l' affichage de la sauce.

  if (typeof req.authentification == "undefined") {
    res.status(403).json({ message: "erreur 403 : Acces denied because!." });
  }

  // (SECURITE AUTHENTIFICATION) si l' id de l' utilisateur correspond à un userId enregistré dans la BDD on autorise l' affichage de la sauce

  userModel.findById({ _id: req.authentification.userId })

    .then(() => {
      productModel.findById({ _id: req.params.id })

        .then((productFound) => {
          res.status(200).json(productFound);
        })
        .catch((error) => {
          res.status(500).json({ message: "Erreur 500 " + error });
        });
    })

    .catch((e) => {
      res.status(403).json({ message: e });
    });
};






/************************************ permet de supprimer un seul produit *************************/

exports.deleteOneProduct = (req, res, next) => {
  // (SECURITE AUTHENTIFICATION) si la propriete "authentification" issu du midellware d' authentification n' existe pas on interdit l' affichage de la sauce.

  if (typeof req.authentification == "undefined") {
    res.status(403).json({ message: "erreur 403 : Acces denied because!." });
  }

  productModel.findById({ _id: req.params.id })

    .then((productFind) => {

      // (SECURITE AUTHENTIFICATION) si l' userId du produit est different de l'userId issu du token on interdit la suppression du produit

      if (productFind.userId != req.authentification.userId) {
        res.status(403).json({ message: " Erreur 403 : Acces denied.!! " });
      }

      const urlProduct = productFind.imageUrl.split("/images/");
      const pathFile = urlProduct[1];
      const fullPathFile = "images/" + pathFile;

      // suppression de l' image correspondante au produit
      fs.unlink(fullPathFile, (error) => {
        if (error) {
          throw error;
        }
      });

      // suppression du produit
      productModel.deleteOne({ _id: req.params.id })

        .then(() => {
          res.status(200).json({ message: "Produit suprimé!" });
        })
        .catch((error) =>
          res.status(500).json({ message: "erreur 500 " + error })
        );
    })

    .catch((error) => {
      res.status(500).json({ message: "erreur 500 " + error });
    });
};




