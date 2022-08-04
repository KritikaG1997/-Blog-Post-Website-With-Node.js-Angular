const multer = require("multer");

// This a function which we have created for storing image in our database

const Storage = multer.diskStorage({

    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        // console.log(file)
        cb(null, `${Date.now()}_${file.originalname}` );
    }
});

var upload = multer({
    storage: Storage,
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.filename + '-' + uniqueSuffix);
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg"
        ) {
            cb(null, true);
        } else {
            res.status(563).send("only png and jpg file");
            cb(null, false);
        };
    },
    limits: {
        fileSize: 1024 * 1024 * 5
    }

})
module.exports = upload;