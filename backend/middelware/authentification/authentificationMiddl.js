/************* gestion de l'authentification sur les requettes ************ */

// import des differents modules
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userModel = require("../../models/userModel");





// middelware  d'authentification 

exports.authCtrl = (req, res, next) => {

  const tokenFull = req.headers.authorization;

  //(SECURITE AUTHENTIFICATION) si la propriete authorisation est nulle on envoi un message d' erreur
  if (tokenFull == null) {
    res.status(403).json({ message: " Acces denied 1 " });
  }

    try {
      const tokenOnly = tokenFull.split(" ");
      const decodedToken = jwt.verify(tokenOnly[1], process.env.KEYTOKEN);

      const Userid = decodedToken.userId;

      req.authentification = {
        userId: Userid,
      };

      // (SECURITE AUTHENTIFICATION) si le userId issu du token est enregistré  dans la base de donnée, l' authentification est validée on passe au middelware suivant.

      userModel.findOne({ _id: Userid })

        .then((result) => {

            if(result == null){

                res.status(403).json({ message : "Acces denied 2"})
            }
            
            next();
            
        })
        .catch((e) => res.status(403).json({ message: "Acces denied! 3" }));
    } 
    catch (e) {
      res.status(403).json({ message: "Acces denied! 4" });
    }

      
}