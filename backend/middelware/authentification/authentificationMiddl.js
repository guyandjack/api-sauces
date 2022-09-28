/************* gestion de l'authentification sur les requettes ************ */
const jwt = require("jsonwebtoken");
require("dotenv").config();





// middelware  d'authentification 

exports.authCtrl = (req, res, next) => {

    const tokenFull = req.headers.authorization;

    
    if(tokenFull != null){

        try{

        const tokenOnly = tokenFull.split(" ");
        const decodedToken = jwt.verify(tokenOnly[1], process.env.KEYTOKEN);
        const Userid = decodedToken.userId;

        req.authentification = {
            userId : Userid
        }

        next();
        }
        
        catch(error){
            res.status(400).json({message : "un bug special "  + error})
        }
    }
    else{
        res.status(403).json({ message : " Acces denied! "})
    }
}