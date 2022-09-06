/*********** importation des modules ********** */

// import du module express
const express = require("express");
const { json } = require("stream/consumers");

//import fu fichirer qui gere la securite CORS 
const securityCors = require("./middelware/securityCORS/securityCorsMiddl");

//import du fichier de connexion à la base de donnée 
const connexionDb = require("./services/mongoDB/connexionDataBase");

//import du router "product"
const productRouter = require("./routes/productRoutes");

//import du router "User"
const userRouter = require("./routes/userRoutes");


/***************  code principal ************************/

// creation de l' appli express
const appli = express();

// permet d' exploiter le contenu json du corps des requettes
appli.use(express.json());

//connexion à la base de donnée MongoDB
connexionDb.connectToMongo();


//parametrage du header de reponse pour annuler la securite "CORS"
appli.use("/", securityCors.setHeader);

// route et logique des requettes concernant l' utilisateur
appli.use("/api/auth", userRouter);

// route et logique des requettes concernant les produits
appli.use("/api/sauces",  productRouter);

// route et logique des requettes conernant les images
appli.use("/images", express.static(path.join(__dirname, "images")));




module.exports = appli;


