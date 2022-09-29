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

  // (SECURITE AUTHENTIFICATION) si le userid de la requette est different de l'userid issu du token on n' autorise pas l' utilisateur à voter...on renvoi la reponse avec un message d' erreur.
  if ( typeof req.authentification == "undefined" || userId != req.authentification.userId) {
    res.status(403).json({ message: "Erreur 403 : Acces denied.!." });
  }

  // recherche du produit dans la base de donnée
  productModel.findById({ _id: sauceId })

    .then((productFind) => {
      // recuperation des données

      const arrayOfLikers = productFind.usersLiked;
      const arrayOfDislikers = productFind.usersDisliked;

      const alreadyLiked = arrayOfLikers.indexOf(userId);
      const alreadyDisliked = arrayOfDislikers.indexOf(userId);

      // si l'utilisateur n' a pas voté
      if (alreadyDisliked == -1 && alreadyLiked == -1) {
        voteAuhtorisation = "both";
      }

      // si l'utilisateur a deja voté
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
            res.status(403).json({
              message: " Vous avez deja voté un 'DISLIKE' pour cette sauce !",
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
              .then((result) => {

                if(result == null){

                  res.status(500).json({ message: "Impossible de valider votre vote 'DISLIKE' " })
                }

                res.status(201).json({ message: " Vote 'DISLIKE' enregistré" });
              })

              .catch((e) => {
                res.status(500).json({
                  message: "Impossible de valider votre vote 'DISLIKE' " + e,
                });
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
              .then((result) => {

                if(result == null){

                  res.status(500).json({ message: "Impossible de valider votre annulation " })
                }
                res.status(201).json({ message: " Vote 'LIKE' annulé " });
              })
              .catch((e) => {
                res
                  .status(500)
                  .json({
                    message: "Impossible de valider votre annulation " + e,
                  });
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
              .then((result) => {
                if(result == null){

                  res.status(500).json({ message: "Impossible de valider votre annulation " })
                }
                res.status(200).json({ message: " Vote 'DISLIKE' annulé" });
              })
              .catch((e) => {
                res
                  .status(500)
                  .json({
                    message: "Impossible de valider votre annulation" + e,
                  });
              });
          }
          break;

        case 1:
          // case : 1 permet à l'utilisateur de voter "LIKE"

          // verifie si l' utilisateur est autorisé à voter "LIKE"
          if (voteAuhtorisation != "both") {
            res
              .status(403)
              .json({
                message: "Vous avez deja voté un 'LIKE' pour cette sauce !",
              });
          }

          productModel
            .findByIdAndUpdate(
              { _id: sauceId },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: userId },
              }
            )

            .then((result) => {

              if(result == null){

                  res.status(500).json({ message: "Impossible de valider votre vote 'LIKE' " })
                }
              res.status(200).json({ message: "vote 'LIKE' enregistré" });
            })

            .catch((e) => {
              res
                .status(500)
                .json({
                  message: "Impossible de valider votre vote 'LIKE' " + e,
                });
            });

          break;
      }
    })

    .catch((e) => {
      res.status(500).json({ message: e });
    });
};

