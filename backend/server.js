/***** creation d' un derveur node****** */
/***************************************** */


//import du module natif "http"
const http = require("http");

//import de l' appli express
const appli = require("./app");

// creation du server avec logique de fonctionnement dans "appli"
const server = http.createServer(appli);

//parametrage des port d' ecoute
server.listen( 3000 || process.env.PORT);
appli.set("port", 3000 || process.env.PORT);
