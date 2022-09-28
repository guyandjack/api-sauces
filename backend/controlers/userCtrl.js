/***** gere la logique des midellware (requettes) concernant les utilisateurs *****************/

// import du module de achage 
const bcrypt = require("bcrypt");

//import du model Mongo "user"
const user = require("../models/userModel");


//import du module jsonwebtoken
const jwt = require("jsonwebtoken");


require("dotenv").config();
const keyToken = process.env.KEYTOKEN;





/****************** permet de créer un nouvel utilisateur *****************************/

exports.createNewUser = (req, res, next) => {

  bcrypt.hash(req.body.password, 10)

    .then((hashedPassword) => {

      const newUser = new user({
        email: req.body.email,
        password: hashedPassword,
      });

      newUser.save()

        .then(() => { res.status(201).json({ message: "Nouvel utilisateur enrgistré" }); })

        .catch((e) => { res.status(500).json({ message : "Erreur 500 : " + e });
        });
    })

    .catch((e) => { res.status(500).json({ message: "Erreur 500 " + e }); });
};





/******************************** permet le login d' un utilisateur **************************/

exports.loginUser = (req, res, next) => {

    // recherche d' utilisateur avec l' email contenu dans la requette
  user.findOne({ email: req.body.email })

    .then((userFound) => {

      if(userFound === null){

        res.status(401).json({ message: " Identifiant ou mot de passe invalide " + error });
      };
      

      bcrypt.compare(req.body.password, userFound.password)

          .then((result) => {

            if(!result){
              res.status(401).json({ message: " Identifiant ou mot de passe invalide" });
            }

            res.status(200).json({

                message: "utilisateur connecté",
                userId: userFound._id,
                token: jwt.sign(
                      {userId : userFound._id} ,
                      keyToken,
                      {expiresIn : "10h"}
                    )
              });
            
          })

          .catch((error) => {
            res.status(500).json({message: "Erreur 500! " + error });
          });

      
    })

    .catch((error) => {
      res
        .status(500)
        .json({ message: " erreur 500 :  " + error });
    });
};

