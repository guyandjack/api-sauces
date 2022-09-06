/***** gere la logique des midellware (requettes) concernant les produits *****************/

//import du model Mongo "product"
const product = require("../models/productModel");



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



// permet de recuperer tout les produits

exports.getAllproduct = (req, res, next) => {

    product.find()

        .then((allProducts) => { res.status(200).json( allProducts )})
        .catch( (e) => { res.status(400).json({ message : "Aucun produit trouvé " + e})});


};


// permet de recuperer un  seul produit

exports.getOneProduct = (req, res, next) => {
  product
    .findOne({ _id: req.params.id })

    .then((productFound) => {
      res.status(200).json( productFound );
    })
    .catch((error) => {
      res.status(400).json({ message: "produit non trouvé " + error });
    });
};



// permet de supprimer un seul produit

exports.deleteOneProduct = (req, res, next) => {

    

  product
    .deleteOne({ _id: req.params.id })

    .then(() => {
      res.status(200).json({ message: "produit suprimé!" });
    })
    .catch((error) => res.status(400).json({ error }));
};
