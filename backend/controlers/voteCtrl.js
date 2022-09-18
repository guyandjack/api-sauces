// import du fichier contenant les model de produit pour la base de donnée
const productModel = require("../models/productModel");

// permet à l' utilisateur de noter la sauce

exports.likeOrDislike = (req, res, next) => {
  // recuperation des données de la requette
  const newVote = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;

  // variables de traitement
  let voteAuhtorisation = "";
  let voteDone = "";

  // si le userid de la requette est different de l'userid issu du token on n' autorise pas l' utilisateur à voter...on renvoi la reponse avec un message d' erreur.
  if (userId != req.authentification.userId) {
    res.status(400).json({ message: "Erreur 403 : Unauthorized user." });
  }

  // verifie si cet user a déja voté (like ou dislike) pour cette sauce
  productModel.findById({ _id: sauceId })

    .then((productFind) => {
      // recuperation des données

      const arrayOfLikers = productFind.usersLiked;
      const arrayOfDislikers = productFind.usersDisliked;

      
      const alreadyLiked = arrayOfLikers.indexOf(userId);
      const alreadyDisliked = arrayOfDislikers.indexOf(userId);
      
      // si l'utilisateur a ni "LIKE" ni "DISLIKE"  
      if (alreadyDisliked == -1 && alreadyLiked == -1) {
        voteAuhtorisation = "both";
      }

      // si l'utilisateur a "LIKE" ou "DISLIKE"
      if (alreadyDisliked != -1 || alreadyLiked != -1) {
        voteAuhtorisation = "delete";
      }

      // determine quel type de vote a été fait  (like ou dislike)
      if (alreadyDisliked == -1 && alreadyLiked != -1) {
        voteDone = "like";
      }

      if (alreadyDisliked != -1 && alreadyLiked == -1) {
        voteDone = "dislike";
      }

      //  execution et enregistrement des votes

      switch (newVote) {
        // permet à l' utilisateur de voter "dislike"
        case -1:
          // verifie si l' utilisateur est autorisè à voter "dislike"
          if (voteAuhtorisation != "both") {
            res
              .status(403)
              .json({
                message: " Vous avez deja voté un 'DISLIKE' pour cette sauce !"
              });
          }

          productModel
            .findByIdAndUpdate(
              { _id: sauceId },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: userId },
              }
            )
            .then(() => {
              res.status(201).json({ message: " Vote 'DISLIKE' enregistré" });
            })
            .catch((e) => {
              res.status(500).json({ message: "voici un bug " + e });
            });

          break;

        case 0:
          // case : 0 permet à l' utilisateur d' annuler son  vote

          // verifie si l' utilisateur est autorisé à annuler son vote
          if (voteAuhtorisation != "delete") {
            res
              .status(403)
              .json({ message: "Vous ne pouvez pas annuler ce vote !" });
          }

          if (voteDone === "like") {
            productModel
              .findByIdAndUpdate(
                { _id: sauceId },
                {
                  $inc: { likes: -1 },
                  $pull: { usersLiked: userId },
                }
              )
              .then(() => {
                res.status(201).json({ message: " Vote 'LIKE' annulé " });
              })
              .catch((e) => {
                res.status(500).json({ message: "un autre bug ici.. " + e });
              });
              
          }

          if (voteDone === "dislike") {
            productModel
              .findByIdAndUpdate(
                { _id: sauceId },
                {
                  $inc: { dislikes: -1 },
                  $pull: { usersDisliked: userId },
                }
              )
              .then(() => {
                res.status(201).json({ message: " Vote 'DISLIKE' annulé" });
              })
              .catch((e) => {
                res.status(500).json({ message: "un autre bug ici.. " + e });
              });
            }
        break;

        case 1:
          // case : 1 permet à l'utilisateur de voter "LIKE"

          // verifie si l' utilisateur est autorisé à voter "LIKE"
          if (voteAuhtorisation != "both") {
            res.status(403).json({ message : "Vous avez deja voté un 'LIKE' pour cette sauce !"})
            
          }


          productModel
            .findByIdAndUpdate(
              { _id: sauceId },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: userId },
              }
            )

            .then(() => {
              res.status(201).json({ message: "vote 'LIKE' enregistré" });
            })

            .catch((e) => {
              res.status(500).json({ message: "ca bug par là " + e });
            });
          
        break;

      }
    })

    .catch((e) => {
      res.status(500).json({ message: "un bug bizare " + e });
    });
};

