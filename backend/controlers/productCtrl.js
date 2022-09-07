/***** gere la logique des midellware (requettes) concernant les produits *****************/

//import du model Mongo "product"
const product = require("../models/productModel");
const user = require("../models/userModel");
const fs = require("fs");



//permet de creer un nouveau produit

exports.createNewProduct = (req, res, next) => {

  const productObject = JSON.parse(req.body.sauce);

  delete productObject.userId;
  
        const newProduct = new product({
          ...productObject,
          userId: req.authentification.userId,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        });

        console.log(req.file)

        newProduct.save()
          .then( () => { res.status(201).json({ message : "produit enregistré"})})
          .catch( (error) => { res.status(400).json({ error })});
        
};



// permet de recuperer tous les produits

exports.getAllproduct = (req, res, next) => {

  // si l' userId issu du token correspond à un utilisateur enregistré dans la DB on autorise l' affichage de toutes les sauces
  user.findOne({ _id : req.authentification.userId })

    .then( () => {

      product.find()

        .then((allProducts) => {
          res.status(200).json(allProducts);
        })
        .catch((e) => {
          res.status(400).json({ message: "Aucun produit trouvé " + e });
        });

    } )

    .catch((e) => { res.status(403).json({ message: "Acces denied " });
  });
 

};


// permet de recuperer un  seul produit

exports.getOneProduct = (req, res, next) => {

  // si l' userId issu du token correspond à un utilisateur enregistré dans la DB on autorise l' affichage du produit selectionné

  user
    .findOne({ _id : req.authentification.userId })

    .then(() => {
      product
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

   product.findOne({ _id : req.params.id })
   
    .then( (productFind) => {

      // si l' userId du produit est le meme userId que celui issu du token on autorise la suppression du produit

      if( productFind.userId == req.authentification.userId){

        const urlProduct = productFind.imageUrl.split("3000");
        const pathFile = urlProduct[1];
        const fullPathFile = "." + pathFile;

        console.log(fullPathFile);

        fs.unlink(fullPathFile, (error) => {
          if (error) {
            throw error;
          }
        });

        product.deleteOne({ _id : req.params.id })

          .then(() => {
            res.status(200).json({ message: "produit suprimé!" });
          })
          .catch((error) => res.status(400).json({ error }));

          

      }
      else{
        res.status(403).json({ message : " Supression du produit refusée "})
      }
    })

    .catch( (error) => { res.status(400).json({ error })});

  
};
