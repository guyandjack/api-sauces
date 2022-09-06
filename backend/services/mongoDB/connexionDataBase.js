// permet de se connecter à la base de donnée MongoDB

exports.connectToMongo = function (){

    const mongoose = require("mongoose");

    mongoose.connect(
    "mongodb+srv://learn-mongodb:learn-mongodb@atlascluster.mm3oggd.mongodb.net/?retryWrites=true&w=majority"
    )
    .then( () => { console.log("connection à mongodb reussi!")})
    .catch( (e) => {console.log("impossible de se connecter à la basse de donnée " + e)});

 }

 
 