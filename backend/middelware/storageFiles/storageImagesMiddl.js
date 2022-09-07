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

        const originalFullName =  file.originalname.split(".");
        const name = originalFullName[0];
        const extension = typeMime[file.mimetype];
        const nameAndExt = name + Date.now() + "." + extension;
                        
        callback(null, nameAndExt);

        
    }

    

    
})

module.exports = multer({ storage : storageImg }).single("image");