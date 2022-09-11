/***** gere la logique des midellware (requettes) concernant les produits *****************/

//import des models Mongo "product" et "user"
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

//import du module fs pour la manipulation de fichiers
const fs = require("fs");




//permet de creer un nouveau produit

exports.createNewProduct = (req, res, next) => {

    const productObject = JSON.parse(req.body.sauce);

    delete productObject.userId;
    
          const newProduct = new productModel({
            ...productObject,
            userId: req.authentification.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            // initialisation des likes et dislikes à 0 pour la creation du produit
            likes : 0,
            dislikes : 0,
            usersLiked : [],
            usersDisliked : []
          });

          newProduct.save()
            .then( () => { res.status(201).json({ message : "produit enregistré"})})
            .catch( (error) => { res.status(400).json({ error })});
        
};

// permet de modifier un produit
exports.updateOneProduct = ( req, res, next) => {

  // récuperation des donneés dans les parametres de la requette
  const sauceId = req.params.id;

  // teste du type de la requette

  // cas ou le format de la requette est un "string" car elle contient une propriete "file"
    if(typeof req.body.sauce === "string"){

      const productModified = JSON.parse(req.body.sauce);

      // si l' iduser de la sauce est le même que l' id user issu du token on autorise la modification

      if( productModified.userId == req.authentification.userId ){
        
        
        const newImageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        
        productModel.updateOne(

          { _id : sauceId },
          { 
            ...productModified,
            imageUrl: newImageUrl
          }
        )

          .then( () => {  res.status(201).json({message : " sauce mise à jour "})})

              
          .catch( (e) => { res.status(400).json({ message : " sauce non actualisée " + e })});
      }

      // message d'eereur si les iduser ne correspondent pas
      else{
        res.status(401).json({ message : " uuser non autorisé "  });
      }

    
    }

    // cas ou le format de la requette est un simple json
    else{

      const productModified = req.body;
      console.log(productModified);

      // si l' iduser de la sauce est le même que l' id user issu du token on autorise la modification

      if (productModified.userId === req.authentification.userId) {

        productModel
          .updateOne(
            { _id: sauceId },
            {
              ...productModified,
              
            }
          )
          .then( () => { res.status(201).json({ message: "sauce mise à jours" })})
              
          .catch((e) => { res.status(400).json({ message: "sauce non actualisée " + e })}); 
       
      }

      // message d'erreur si les id ne correspondent pas
      else {
        res.status(401).json({ message: " user non autorisé "  });
      }
    }
    
}; 



// permet de recuperer tous les produits

exports.getAllproduct = (req, res, next) => {

  // si l' userId issu du token correspond à un utilisateur enregistré dans la DB on autorise l' affichage de toutes les sauces
  userModel
    .findOne({ _id : req.authentification.userId  })

    .then(() => {
      productModel
        .find()

        .then((allProducts) => {
          res.status(200).json(allProducts);
        })
        .catch((e) => {
          res.status(400).json({ message: "Aucun produit trouvé " + e });
        });
    })

    .catch((e) => {
      res.status(401).json({ message: "Acces denied!!! " });
    });
 

};


// permet de recuperer un  seul produit

exports.getOneProduct = (req, res, next) => {

  // si l' userId issu du token correspond à un utilisateur enregistré dans la DB on autorise l' affichage du produit selectionné

  userModel
    .findOne({ _id : req.authentification.userId })

    .then(() => {
      productModel
        .findOne({ _id : req.params.id })

        .then((productFound) => {
          res.status(200).json(productFound);
        })
        .catch((error) => {
          res.status(400).json({ message: "produit non trouvé " + error });
        });
    })
    .catch((e) => {
      res.status(403).json({ message: "Acces denied " });
    });
 
};



// permet de supprimer un seul produit

exports.deleteOneProduct = (req, res, next) => {

   productModel.findOne({ _id : req.params.id })
   
    .then( (productFind) => {

      // si l' userId du produit est le meme userId que celui issu du token on autorise la suppression du produit

      if( productFind.userId == req.authentification.userId){

        const urlProduct = productFind.imageUrl.split("3000");
        const pathFile = urlProduct[1];
        const fullPathFile = "." + pathFile;

        fs.unlink(fullPathFile, (error) => {
          if (error) {
            throw error;
          }
        });

        productModel.deleteOne({ _id : req.params.id })

          .then(() => {
            res.status(200).json({ message: "produit suprimé!" });
          })
          .catch((error) => res.status(500).json({ error }));

          

      }
      else{
        res.status(401).json({ message : " Supression du produit refusée "})
      }
    })

    .catch( (error) => { res.status(500).json({ error })});

  
};




