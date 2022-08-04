// const { Verify } = require("crypto");
const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    // console.log("req")
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    // console.log(authHeader)
    if (authHeader) {
        
        jwt.verify(authHeader, "userVerify", (err, userVerify) => { 
            if (err) {
                // res.send(404);
                res.status(400).send({
                    message:"token not verified"
                })
            }
            else {
                req.userVerify = userVerify;
                // console.log(user);
                next()

            };
        });
    } else {
       res.status(530).send("Token Invalid");
    };
};


/* this our middleware function in this we are verifying the token which we have created while login 
 this middleware we are using for authonticate the user is right or wrong*/
