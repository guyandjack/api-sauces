/************* gestion de l'authentification sur les requettes ************ */
const jwt = require("jsonwebtoken");


// middelware  d'authentification 

exports.authCtrl = (req, res, next) => {

    const tokenFull = req.headers.authorization;

    if(tokenFull != null){

        try{

        const tokenOnly = tokenFull.split(" ");
        const decodedToken = jwt.verify(tokenOnly[1], "CLEF-ENCODAGE-TOKEN");
        const Userid = decodedToken.userId;

        req.authentification = {
            userId : Userid
        }

        next();
        }
        
        catch(error){
            res.status(400).json({message :  error})
        }
    }
    else{
        res.status(404).json({ message : " Il faut être authentifié pour acceder à ce service "})
    }
}