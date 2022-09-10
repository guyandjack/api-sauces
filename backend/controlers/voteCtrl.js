// import du fichier contenant les model de produit pour la base de donnée
const productModel = require("../models/productModel");


// permet à l' utilisateur de noter la sauce

exports.likeOrDislike = (req, res, next) => {

    // recuperation des données de la requette
    const newVote = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    let alreadyVote = false;
    

    switch (newVote) {

      case -1:
        // case : -1 permet à l' utilisateur de voter "DISLIKE"

        // verifie si cet user a deja "disliké" pour cette sauce
        productModel.findOne({ _id: sauceId })

            .then((productFound) => {
                console.log(productFound);
                // recuperation des données du produit
                const arrayOfUsersDisliker = productFound.usersDisliked;
                let numberOfDislikes = parseInt(productFound.dislikes, 10);

                for (let userDisliker of arrayOfUsersDisliker) {

                    if (userDisliker == userId) {
                        res.status(403).json({ message : "impossible de voter à nouveau pour cette sauce, uniquement la possibilite d' annuler votre vote précédent",
                        });
                        alreadyVote = true;
                        break;
                    } 
                }

                if(!alreadyVote){

                    numberOfDislikes = numberOfDislikes + 1;
                    console.log("le nbr de dislikes est de : " + numberOfDislikes)

                    productModel.findByIdAndUpdate(
                        { _id : sauceId },
                        {
                            dislikes : numberOfDislikes,
                            $push : { usersDisliked : userId }
                            
                        }
                    )
                        .then( () => { res.status(201).json({ message: " Vote 'DISLIKE' enregistré" });} )
                        .catch( (e) => { res.status(400).json({ message: "voici un bug " + e })});
        
                }    
            })
                    

            .catch((e) => res.status(400).json({ e }));
        break;

      case 0:
          
     // case : 0 permet à l' utilisateur d' annuler son  vote 

      productModel.findOne({ _id: sauceId })

            .then( (productFind) => {

            //recuperation des données du produit

                
                let numberOfLikes =  parseInt(productFind.likes, 10);
                let numberOfDislikes = parseInt(productFind.dislikes, 10);
                
                let arrayOfUsersLiker = productFind.usersLiked; 
                let arrayOfUsersDisliker = productFind.usersDisliked; 

                // permet de connaitre le type du dernier vote (like ou dislike) de l' utilisateur

                for ( let userLiker of arrayOfUsersLiker){
                    
                    if( userLiker == userId){
                        
                        numberOfLikes = numberOfLikes - 1;
                        productModel.findByIdAndUpdate(
                            { _id : sauceId },
                            {
                                likes : numberOfLikes ,
                                $pull : { usersLiked : userId }
                            }
                                                
                        )
                            .then(() => { res.status(200).json({ message : " Like annulé"})})
                            .catch( (e) => { res.status(400).json({ message : "un autre bug ici.. " + e })});
                        break;
                    }
                }
            

                for (let userDisliker of arrayOfUsersDisliker) {

                    if( userDisliker == userId){
                        
                        numberOfDislikes = numberOfDislikes - 1;
                        productModel.findByIdAndUpdate(
                            { _id : sauceId },
                            {
                                dislikes : numberOfDislikes ,
                                $pull : { usersDisliked : userId }
                            }
                                                
                        )
                            .then(() => { res.status(200).json({ message : " Dislike annulé"})})
                            .catch( (e) => { res.status(400).json({ message : "un autre bug là.. " + e})});
                        break;
                    }
                }

            })
          
            .catch((e) => { res.status(500).json({ message: "peut etre un bug la "  + e })});
        
        break;

      case 1:
        // case : 1 permet a l'utilisateur de voter "LIKE"

        // verifie si cet user a deja "liké" pour cette sauce
        productModel.findOne({ _id : sauceId })

          .then((productFound) => {

            // recuperation des données du produit
            let arrayOfUsersLiker = productFound.usersLiked;
            let numberOfLike = parseInt(productFound.likes, 10);
            
            for (let userLiker of arrayOfUsersLiker) {

                // si un id liste dans le tableau correspond à notre userId
                if (userLiker == userId) {
                    res.status(403).json({ message : 
                        "impossible de voter à nouveau pour cette sauce, uniquement la possibilite d' annuler votre vote précédent",
                    });
                    
                    alreadyVote = true;
                    break;
                }
            }  

            if(!alreadyVote){
                
                numberOfLike = numberOfLike + 1;
                console.log(numberOfLike);

                productModel
                  .findByIdAndUpdate(
                    { _id : sauceId },
                    {
                    likes: numberOfLike,
                    $push: { usersLiked : userId },
                    
                    })

                  .then(() => {
                    res.status(201).json({ message: "vote 'LIKE' enregistré" });
                  })

                  .catch((e) => {
                    res.status(500).json({ message : "ca bug par là " + e });
                  });
            }
            
        })

        .catch((e) => res.status(500).json({ message : "ca bug ici " + e }));

        
        break;
    }
  
};
