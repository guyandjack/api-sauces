/***** gere la logique des midellware (requettes) concernant les utilisateurs *****************/

// import du module de achage 
const bcrypt = require("bcrypt");

//import du model Mongo "user"
const user = require("../models/userModel");


//import du module jsonwebtoken
const jwt = require("jsonwebtoken");




// permet de creer un nouvel utilisateur

exports.createNewUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)

    .then((hashedPassword) => {
      const newUser = new user({
        email: req.body.email,
        password: hashedPassword,
      });

      newUser
        .save()

        .then(() => {
          res.status(201).json({
            message: "Nouvel utilisateur enrgistré",
          });
        })

        .catch((e) => {
          res.status(500).json({ e });
        });
    })

    .catch((e) => {
      res.status(500).json({ message: "mot de passe non aché" + e });
    });
};


// permet le login d' un utilisateur

exports.loginUser = (req, res, next) => {

  user.findOne({ email: req.body.email })

    .then((userFound) => {
      if (userFound) {
        bcrypt
          .compare(req.body.password, userFound.password)

            .then((result) => {
              if (result) {
                res.status(200).json({
                  message: "utilisateur connecté",
                  userId: userFound._id,
                  token: jwt.sign( 
                      { userId : userFound._id },
                      "CLEF-ENCODAGE-TOKEN",
                      { expiresIn : "10h"})
                });
              } else {
                res
                  .status(401)
                  .json({ message: " Identifiant ou mot de passe invalide" });
              }
            })

            .catch((error) => {
              res
                .status(500)
                .json({
                  message: "impossible de comparer les mots de passe " + error,
                });
            });

      } else {
        res
          .status(401)
          .json({ message: " Identifiant ou mot de passe invalide" });
        }
    })

    .catch((error) => {
      res
        .sendStatus(500)
        .json({ message: " impossible de trouver l' email " + error });
    });
};