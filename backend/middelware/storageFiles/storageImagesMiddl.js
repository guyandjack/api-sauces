const multer = require("multer");
const { moveMessagePortToContext } = require("worker_threads");



const typeMime = {
    "image/jpeg" : "jpg",
    "image/jpg" : "jpg",
    "image/png" : "png",
    "image/webp" : "webp"
}

const storageImg = multer.diskStorage({


    destination : ( req, file, callback) => {
        callback( null, "images")
    },
   
    filename : (req, file, callback ) => {

        const name =  file.originalname;
        const extension = typeMime[file.mimetype];
        const nameAndExt = name + Date.now() + "." + extension;
        console.log(nameAndExt);

        //req.name = nameAndExt;
                
        callback(null, nameAndExt);

        
    }

    

    
})

module.exports = multer({ storage : storageImg }).single("image");