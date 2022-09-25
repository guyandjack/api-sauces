// import du model mongoose "user"
const productModel = require("../models/productModel");

exports.vote = ( req, res, next) => {

    // recuperation des données de la requette et variables de fonctionnement
    const userId = req.userId;
    const vote = req.like;
    const userTokenId = req.authentification.userId;
    const sauceId = req.params.id;

    let dataUpdate = {
        like : null,
        dislike : null,
        push : null,
        pull : null,
        responseMessage : null
    }

    //  Si le userid issu de la requette est different du  userId issu du token l' acces à cette requette est refusée.
    if(userId == userTokenId){
        res.status(403).json({ message : " Acces denied "})
    }

    //recherche du produit dans la base de donnée
    productModel.findById({ _id : sauceId })  

        .then((productFind)=> {
            //recupere le nombre de like et dislike
            let numberOfLikes = productFind.like;
            let numberOfDislikes = productFind.dislike;

            //recupere le tableau des identifiants  utilisateurs qui on votés
            const arrayOfLikers = productFind.usersLiked;
            const arrayOfDislikers = productFind.usersDisliked;
            let voteAllowed = null;
            let voteDone = null;

            //si l' utilisateur n' a pas voté pour cette sauce on autorise un vote
            if (
            arrayOfLikers.indexOf(userId) == -1 &&
            arrayOfDislikers.indexOf(userId) == -1
            ) {
            voteAllowed = "both";
            }

            //si l' utilisateur  a deja voté pour cette sauce on autorise une annualtion
            if (
            arrayOfLikers.indexOf(userId) != -1 ||
            arrayOfDislikers.indexOf(userId) != -1
            ) {
            voteAllowed = "cancel";
            }

            //determine le type de vote "dislike"
            if (
            arrayOfLikers.indexOf(userId) == -1 &&
            arrayOfDislikers.indexOf(userId) != -1
            ) {
            voteDone = "dislike";
            }

            //determine le type vote "like"
            if (
            arrayOfLikers.indexOf(userId) != -1 &&
            arrayOfDislikers.indexOf(userId) == -1
            ) {
            voteDone = "like";
            }

            // parametrage des données pour la mise à jour des votes
            switch (vote) {
              // permet a l'utilisateur de voter "DISLIKE"
              case -1:
                //Verifie si l' utilisateur est autorisé à voter "DISLIKE"
                if (voteAllowed != "both") {
                  res.status(403).json({ message: "Acces denied!" });
                }

                // données à mettre à jour
                dataUpdate = {
                  like : numberOfLikes,
                  dislike: numberOfDislikes + 1,
                  push: userId,
                  responseMessage: "Vote 'DISLIKE' enregistré",
                };
                break

              // permet à l'utilisateur d' annuler son vote precedent
              case 0:
                //Verifie si l' utilisateur est autorisé à annuler son vote
                if (voteAllowed != "cancel") {
                  res.status(403).json({ message: "Acces denied!!" });
                }

                // données à mettre à jour
                if(voteDone == "like"){
                    dataUpdate = {
                    like : numberOfLikes,
                    dislike: numberOfDislikes - 1,
                    pull: userId,
                    push: null,
                    responseMessage: "Vote annulé",
                    };
                }

                if(voteDone == "dislike"){
                    dataUpdate = {
                    like: numberOfLikes - 1,
                    dislike: numberOfDislikes,
                    pull: userId,
                    push: null,
                    responseMessage: "Vote annulé",
                    };
                }
                break
            

              // permet à l'utilisateur de voter "LIKE"
              case 1:
                //Verifie si l' utilisateur est autorisé à voter "LIKE"
                if (voteAllowed != "both") {
                  res.status(403).json({ message: "Acces denied!!!" });
                }

                // données à mettre à jour
                dataUpdate = {
                  like: numberOfLikes + 1,
                  dislike : numberOfDislikes,
                  push: userId,
                  pull: null,
                  responseMessage: "Vote 'LIKE' enregistré",
                };
            }

            productFind
              .update({
                like: dataUpdate.like,
                dislike: dataUpdate.dislike,
                $push: { usersLiked :dataUpdate.push },
                $push: { usersDisliked :dataUpdate.push },
                $pull: { usersLiked : dataUpdate.pull},
                $pull: { usersDisliked : dataUpdate.pull}
                
              })

              .then(() => { res.status(200).json({ message : dataUpdate.responseMessage})})
              .catch((e) => res.status(500).json({ message : "pas de mise a jour " + e }));
           
        })

        .catch((e)=> res.status(500).json({message : "pas de produit trouvé " + e}))

}